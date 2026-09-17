# Sanket Bisne - Personal Developer & Speaker Portfolio

Modern, high-performance developer portfolio and speaker showcase for **[sanketbisne.github.io](https://sanketbisne.github.io)**.

Built with pure modern web technologies (HTML5, CSS3 Custom Properties & Glassmorphism, and ES6 Modules) requiring **zero build steps** or CI/CD pipelines. It is **100% natively compatible with GitHub Pages**.

---

## 🚀 How to Host & Deploy to `sanketbisne.github.io`

### 1. Initialize Git Repository (if not already done)
Open your terminal in this directory (`/Users/sanketbisne/sanket-bisne`):

```bash
git init
git add .
git commit -m "feat: recreate modern portfolio website for sanketbisne.github.io"
```

### 2. Connect to your GitHub Pages Repository
If you haven't linked the remote repository yet:

```bash
git branch -M main
git remote add origin https://github.com/sanketbisne/sanketbisne.github.io.git
git push -u origin main
```

*(If the remote is already linked or you are pushing an update, just run `git push origin main`)*

---

### 3. Verify GitHub Pages Settings
1. Go to your GitHub repository: [github.com/sanketbisne/sanketbisne.github.io](https://github.com/sanketbisne/sanketbisne.github.io)
2. Navigate to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` and folder `/ (root)`
   - Click **Save**.
4. Within 30–60 seconds, your site will be live at:
   👉 **[https://sanketbisne.github.io](https://sanketbisne.github.io)**

---

## ✨ Features

- **Cybernetic Glass & Dark Mode**: Sleek dark aesthetic (`#080b11`) with animated ambient glowing gradients and frosted glass cards.
- **Authentic Career & GDE Data**: Incorporates Google Developer Expert (GCP) credentials, Senior DevOps role at Lloyds Banking Group, and community leadership.
- **Interactive Speaking & Workshop Filter**: Categorized talks on Google ADK, Agentic AI, Cloud Spanner Omni on GKE, and Prometheus/Grafana MCP Observability.
- **Open-Source Repositories**: Real GitHub project cards linking to `omni-spanner`, `gcs-mcp-server`, `adk-k8s-gcs-agent`, and `gemini-grafana-gke-observability`.
- **Sessionize & Speaker Request Modal**: Integrated booking dialog with mailto prefill and links to Sessionize, LinkedIn, Medium, and GitHub.
- **100% Zero-Build & Lightweight**: Fast load times, SEO-optimized OpenGraph tags, and JSON-LD schema metadata.

---

## 🛠️ Local Preview

You can preview the website locally in any browser simply by opening `index.html`, or by running a lightweight local server:

```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
