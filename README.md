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

## Update website statistics

Export the SharePoint inventory as CSV and save it locally as `data/aviaries.csv`.

Calculate the totals and rebuild:

```bash
node scripts/update-stats.mjs data/aviaries.csv
node scripts/build.mjs
```

Push the updated `content/stats.json` to GitHub to publish the totals.

The CSV is private: keep `data/aviaries.csv` in `.gitignore` and do not upload it to GitHub.

Zoo and individual counts are calculated automatically. The species count and recording hours remain unchanged until separately reviewed.

## Files and folders

- `site/` — Website source: HTML pages, `style.css`, and `images/`.
- `dist/` — Generated website. Created when you build; do not edit directly or push to GitHub.
- `.pages.yml` — Configuration for editing content through Pages CMS.
- `content/` — JSON files for projects, events, publications, team members, and website statistics.
- `data/` — Private local inventory CSV; excluded from GitHub.
- `scripts/` — Scripts to build the website and calculate statistics from the CSV.

Edit files in `site/` or `content/`, then rebuild to see changes locally.
Push your changes to GitHub to update the public website through Cloudflare.
