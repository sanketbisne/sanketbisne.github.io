#!/usr/bin/env python3
"""Synchronize Medium, GitHub, Instagram, and LinkedIn feeds into data/feeds.json.

Zero external dependencies (Python standard library only). Designed to run inside
GitHub Actions (.github/workflows/sync-content.yml) on a cron schedule or dispatch.
"""

from __future__ import annotations

import argparse
import datetime as dt
import email.utils
import html
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
FEEDS_PATH = REPO_ROOT / "data" / "feeds.json"
INSTAGRAM_DIR = REPO_ROOT / "images" / "instagram"

MEDIUM_RSS_URL = "https://medium.com/feed/@sanketbisne"
GITHUB_REPOS_URL = "https://api.github.com/users/sanketbisne/repos?per_page=100&sort=pushed"
DEFAULT_UA = "Mozilla/5.0 (compatible; SanketBisnePortfolioSync/1.0; +https://sanketbisne.github.io)"

ATOM_NS = "{http://www.w3.org/2005/Atom}"
CONTENT_NS = "{http://purl.org/rss/1.0/modules/content/}"
DC_NS = "{http://purl.org/dc/elements/1.1/}"

SKIP_REPOS = {"sanketbisne.github.io", "sanketbisne"}


def http_get(url: str, headers: dict[str, str] | None = None, timeout: int = 20) -> bytes:
    """Perform a standard library HTTPS GET with sane headers."""
    req_headers = {"User-Agent": DEFAULT_UA}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, headers=req_headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def clean_medium_url(raw_url: str) -> str:
    """Strip RSS tracking parameters from Medium URLs."""
    parsed = urllib.parse.urlsplit(raw_url.strip())
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, "", ""))


def strip_html(raw_html: str) -> str:
    """Convert an HTML fragment into clean normalized plain text."""
    text = re.sub(r"<figure[\s\S]*?</figure>", " ", raw_html, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def truncate_text(text: str, max_len: int = 185) -> str:
    """Truncate text cleanly at a word boundary."""
    if len(text) <= max_len:
        return text
    cut = text[: max_len - 1].rsplit(" ", 1)[0].rstrip(".,;:")
    return f"{cut}..."


def extract_medium_image(html_body: str, fallback: str = "") -> str:
    """Return the first real article image URL, ignoring Medium tracking pixels."""
    for match in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html_body, flags=re.IGNORECASE):
        src = html.unescape(match.group(1)).strip()
        if not src or "/_/stat" in src or "medium.com/_/stat" in src:
            continue
        if src.startswith("https://"):
            return src
    return fallback


def infer_medium_badge(title: str, categories: list[str], index: int, date_display: str) -> tuple[str, str]:
    """Choose a clean display badge and badge type for a Medium post."""
    if index == 0:
        short_month_year = re.sub(r"\s+\d+,\s+", " ", date_display)
        return f"✨ Latest • {short_month_year}", "latest"
    haystack = f"{title} {' '.join(categories)}".lower()
    if "webmcp" in haystack or "adk" in haystack:
        return "🤖 WebMCP & ADK", "topic"
    if "mcp" in haystack and "cloud run" in haystack:
        return "⚡ MCP & Cloud Run", "topic"
    if "mcp" in haystack:
        return "⚡ Model Context Protocol", "topic"
    if "docker" in haystack:
        return "🐳 Docker AI", "topic"
    if "dbt" in haystack:
        return "☁️ Data & dbt", "topic"
    if "opentofu" in haystack:
        return "🛠️ OpenTofu & IaC", "topic"
    if "terraform" in haystack:
        return "🔔 Terraform & Cloud", "topic"
    if "kubernetes" in haystack or "gke" in haystack:
        return "☸️ Kubernetes & GKE", "topic"
    return "📝 Engineering Guide", "topic"


def infer_platform(url: str) -> str:
    """Infer publication name from Medium URL path."""
    lower = url.lower()
    if "medium.com/google-cloud/" in lower:
        return "Google Cloud - Community"
    if "medium.com/@sanketbisne/" in lower:
        return "Medium"
    return "Medium Publication"


def parse_medium_rss(xml_bytes: bytes, existing_posts: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Parse Medium RSS XML into normalized article dictionaries."""
    existing_by_url = {clean_medium_url(item.get("url", "")): item for item in existing_posts}
    root = ET.fromstring(xml_bytes)
    channel = root.find("channel")
    if channel is None:
        return existing_posts

    parsed_items: list[dict[str, Any]] = []
    for idx, item in enumerate(channel.findall("item")[:6]):
        title = html.unescape((item.findtext("title") or "").strip())
        link = clean_medium_url(item.findtext("link") or "")
        if not title or not link:
            continue

        pub_raw = (item.findtext("pubDate") or "").strip()
        try:
            pub_dt = email.utils.parsedate_to_datetime(pub_raw)
            date_display = f"{pub_dt.strftime('%b')} {pub_dt.day}, {pub_dt.year}"
            iso_date = pub_dt.strftime("%Y-%m-%d")
        except Exception:
            date_display = pub_raw[:12] or "Recent"
            iso_date = ""

        encoded = item.findtext(f"{CONTENT_NS}encoded") or item.findtext("description") or ""
        categories = [(c.text or "").strip() for c in item.findall("category") if c.text]

        prior = existing_by_url.get(link, {})
        image = extract_medium_image(encoded, fallback=prior.get("image", ""))
        summary = prior.get("summary") or truncate_text(strip_html(encoded), 195)
        badge, badge_type = infer_medium_badge(title, categories, idx, date_display)
        if prior.get("badge") and (idx == 0 or not prior["badge"].startswith("✨ Latest")):
            badge = prior["badge"]

        parsed_items.append(
            {
                "title": prior.get("title") or title,
                "url": link,
                "date": prior.get("date") or date_display,
                "iso_date": prior.get("iso_date") or iso_date,
                "platform": prior.get("platform") or infer_platform(link),
                "badge": badge,
                "badge_type": badge_type,
                "image": image,
                "summary": summary or title,
            }
        )

    return parsed_items or existing_posts


def infer_repo_category(repo: dict[str, Any]) -> str:
    """Infer portfolio filter category for a newly discovered GitHub repository."""
    text = f"{repo.get('name', '')} {repo.get('description') or ''} {' '.join(repo.get('topics') or [])}".lower()
    cats: list[str] = []
    if any(k in text for k in ("adk", "mcp", "agent", "ai", "llm", "gemini", "langgraph", "vllm", "rag")):
        cats.append("ai-adk")
    if any(k in text for k in ("gcp", "cloud", "gke", "k8s", "kubernetes", "spanner", "sql", "terraform", "tofu")):
        cats.append("cloud-infra")
    if any(k in text for k in ("grafana", "prometheus", "otel", "opentelemetry", "observability", "alert", "monitor")):
        cats.append("observability")
    return " ".join(cats) if cats else "ai-adk"


def sync_github_repos(existing_repos: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Refresh star counts and append newly pushed public GitHub repos."""
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if token:
        headers["Authorization"] = f"Bearer {token}"

    payload = json.loads(http_get(GITHUB_REPOS_URL, headers=headers).decode("utf-8"))
    if not isinstance(payload, list):
        return existing_repos

    by_name: dict[str, dict[str, Any]] = {}
    for repo in payload:
        name = repo.get("name", "")
        if not name or repo.get("fork") or repo.get("archived") or name in SKIP_REPOS:
            continue
        by_name[name] = repo

    updated: list[dict[str, Any]] = []
    seen: set[str] = set()
    for item in existing_repos:
        name = item["name"]
        seen.add(name)
        live = by_name.get(name)
        merged = dict(item)
        if live is not None:
            merged["stars"] = int(live.get("stargazers_count", merged.get("stars", 0)))
            merged["url"] = live.get("html_url", merged["url"])
        updated.append(merged)

    # Include up to 2 recently pushed new repos not yet listed if non-trivial description exists
    extras = 0
    for name, repo in by_name.items():
        if name in seen or extras >= 2:
            continue
        desc = (repo.get("description") or "").strip()
        if len(desc) < 20:
            continue
        topics = [t.upper() if len(t) <= 4 else t.title() for t in (repo.get("topics") or [])[:4]]
        if not topics and repo.get("language"):
            topics = [repo["language"]]
        updated.append(
            {
                "name": name,
                "url": repo["html_url"],
                "description": truncate_text(desc, 190),
                "category": infer_repo_category(repo),
                "icon": "✨",
                "featured": False,
                "badge_label": f"★ {repo.get('language') or 'Open Source'}",
                "stars": int(repo.get("stargazers_count", 0)),
                "tags": topics or ["GitHub", "Open Source"],
            }
        )
        extras += 1

    return updated[:10]


def download_image(url: str, target_path: Path) -> bool:
    """Download a thumbnail image locally so expiring CDN URLs never break."""
    try:
        data = http_get(url, timeout=20)
        if len(data) < 512:
            return False
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_bytes(data)
        return True
    except Exception:
        return False


def sync_instagram_posts(existing_posts: list[dict[str, Any]], dry_run: bool = False) -> list[dict[str, Any]]:
    """Fetch latest Instagram posts via Meta Graph API when IG_ACCESS_TOKEN is configured."""
    token = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    if not token:
        return existing_posts

    fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
    api_url = (
        f"https://graph.instagram.com/me/media?fields={urllib.parse.quote(fields)}"
        f"&limit=8&access_token={urllib.parse.quote(token)}"
    )
    resp = json.loads(http_get(api_url).decode("utf-8"))
    media_list = resp.get("data", [])
    if not isinstance(media_list, list) or not media_list:
        return existing_posts

    existing_by_url = {item["url"].rstrip("/"): item for item in existing_posts}
    synced: list[dict[str, Any]] = []

    for media in media_list[:8]:
        permalink = (media.get("permalink") or "").strip()
        media_id = str(media.get("id") or "").strip()
        if not permalink or not media_id:
            continue

        prior = existing_by_url.get(permalink.rstrip("/"))
        thumb_remote = media.get("thumbnail_url") or media.get("media_url") or ""
        local_rel = prior["image"] if prior else f"images/instagram/ig-auto-{media_id}.jpg"
        local_abs = REPO_ROOT / local_rel

        if not local_abs.exists() and thumb_remote and not dry_run:
            if not download_image(thumb_remote, local_abs):
                continue
        if not local_abs.exists() and dry_run and not prior:
            continue

        caption_raw = re.sub(r"\s+", " ", (media.get("caption") or "").split("\n")[0]).strip()
        badge = prior["badge"] if prior else ("🎬 Reel" if media.get("media_type") == "VIDEO" else "📸 Instagram")
        caption = prior["caption"] if prior else (truncate_text(caption_raw, 48) or "Latest Instagram Update")
        alt = prior["alt"] if prior else (truncate_text(caption_raw, 110) or caption)

        synced.append(
            {
                "id": prior["id"] if prior else f"ig-auto-{media_id}",
                "url": permalink,
                "image": local_rel,
                "alt": alt,
                "badge": badge,
                "caption": caption,
            }
        )

    return synced or existing_posts


def ingest_linkedin_payload(existing_posts: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Prepend a new LinkedIn highlight delivered via dispatch payload/inputs."""
    raw = os.environ.get("LINKEDIN_PAYLOAD", "").strip()
    if not raw:
        return existing_posts
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        print("[sync_feeds] Ignoring invalid LINKEDIN_PAYLOAD JSON")
        return existing_posts

    title = (payload.get("title") or "").strip()
    url = (payload.get("url") or "https://www.linkedin.com/in/sanketbisne").strip()
    summary = (payload.get("summary") or "").strip()
    if not title or not url.startswith("https://"):
        return existing_posts

    tag = (payload.get("tag") or "LinkedIn Highlight").strip()
    date_label = (payload.get("date") or dt.datetime.now(dt.timezone.utc).strftime("%b %Y")).strip()
    cta = (payload.get("cta") or "Read on LinkedIn").strip()
    post_id = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:36] or "li-post"

    new_entry = {
        "id": f"li-{post_id}",
        "tag": tag,
        "date": date_label,
        "title": truncate_text(title, 95),
        "summary": truncate_text(summary or title, 185),
        "url": url,
        "cta": cta,
    }

    deduped = [p for p in existing_posts if p.get("url") != url and p.get("title") != new_entry["title"]]
    return [new_entry, *deduped][:6]


def update_ticker(feeds: dict[str, Any]) -> list[dict[str, Any]]:
    """Keep shipping ticker synchronized with newest Medium and LinkedIn posts."""
    ticker = list(feeds.get("shipping_ticker") or [])
    medium = feeds.get("medium") or []
    if medium:
        newest = medium[0]
        if len(ticker) >= 2 and ticker[1].get("href") != newest["url"]:
            ticker[1] = {
                "tag": "New Post",
                "color": "green",
                "text": truncate_text(newest["title"], 72),
                "href": newest["url"],
            }
        elif len(ticker) < 2:
            ticker.append(
                {
                    "tag": "New Post",
                    "color": "green",
                    "text": truncate_text(newest["title"], 72),
                    "href": newest["url"],
                }
            )
    return ticker


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync portfolio feeds into data/feeds.json")
    parser.add_argument("--dry-run", action="store_true", help="Print diff status without writing data/feeds.json")
    parser.add_argument("--medium-xml", type=Path, help="Optional local Medium RSS XML path for offline testing")
    args = parser.parse_args()

    if not FEEDS_PATH.exists():
        raise FileNotFoundError(f"Missing baseline feeds file: {FEEDS_PATH}")

    original = json.loads(FEEDS_PATH.read_text(encoding="utf-8"))
    updated = json.loads(json.dumps(original))  # deep copy

    # 1. Medium RSS
    try:
        if args.medium_xml:
            xml_bytes = args.medium_xml.read_bytes()
        else:
            xml_bytes = http_get(MEDIUM_RSS_URL)
        updated["medium"] = parse_medium_rss(xml_bytes, original.get("medium", []))
        print(f"[sync_feeds] Medium articles: {len(updated['medium'])}")
    except Exception as exc:
        print(f"[sync_feeds] Medium sync skipped/fallback ({exc})")

    # 2. GitHub Public Repos (skipped when offline XML test only if unreachable)
    if not args.medium_xml:
        try:
            updated["github"] = sync_github_repos(original.get("github", []))
            print(f"[sync_feeds] GitHub repos: {len(updated['github'])}")
        except Exception as exc:
            print(f"[sync_feeds] GitHub sync skipped/fallback ({exc})")

        # 3. Instagram Graph API (optional IG_ACCESS_TOKEN secret)
        try:
            updated["instagram"] = sync_instagram_posts(original.get("instagram", []), dry_run=args.dry_run)
            print(f"[sync_feeds] Instagram items: {len(updated['instagram'])}")
        except Exception as exc:
            print(f"[sync_feeds] Instagram sync skipped/fallback ({exc})")

    # 4. LinkedIn dispatch payload (optional webhook/manual input)
    updated["linkedin"] = ingest_linkedin_payload(original.get("linkedin", []))
    updated["shipping_ticker"] = update_ticker(updated)

    # Check meaningful changes ignoring updated_at
    cmp_orig = {k: v for k, v in original.items() if k != "updated_at"}
    cmp_new = {k: v for k, v in updated.items() if k != "updated_at"}

    if cmp_orig == cmp_new:
        print("[sync_feeds] No content changes detected.")
        return 0

    updated["updated_at"] = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    serialized = json.dumps(updated, indent=2, ensure_ascii=False) + "\n"

    if args.dry_run:
        print("[sync_feeds] Dry-run detected changes; file not written.")
        return 0

    FEEDS_PATH.write_text(serialized, encoding="utf-8")
    print(f"[sync_feeds] Updated {FEEDS_PATH.relative_to(REPO_ROOT)} at {updated['updated_at']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
