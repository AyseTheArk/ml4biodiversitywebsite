# ML4Biodiversity

## Requirements

- Node.js (LTS version): https://nodejs.org

## Run locally

Build the website:

```bash
node scripts/build.mjs
```

Start a local server:

**Windows PowerShell:**

```Shell
npx.cmd serve dist
```

**macOS/Linux:**

```bash
npx serve dist
```

If prompted to install `serve`, enter `y`. Open the localhost URL shown in the terminal.

After editing files, rebuild:

```bash
node scripts/build.mjs
```

Refresh your browser to see the changes. Press `Ctrl+C` to stop the server.


## Files and folders

- `site/` — Website source: HTML pages, `style.css`, and `images/`.
- `content/` — JSON files for projects, events, publications, and team members.
- `scripts/` — Build script that combines the website source and JSON content.
- `dist/` — Generated website. Created when you build; do not edit directly or push to GitHub.
- `.pages.yml` — Configuration for editing content through Pages CMS.

Edit files in `site/` or `content/`, then rebuild to see changes locally.
Push your changes to GitHub to update the public website through Cloudflare.
