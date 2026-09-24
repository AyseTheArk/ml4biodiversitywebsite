# ML4Biodiversity website transition

This is the approved redesign prepared for **Cloudflare Pages + Pages CMS**. It is a static site with no paid framework or build dependencies. The live WordPress site and domain have not been changed.

## Publish it

1. Create a **private GitHub repository**, for example `ml4biodiversity-website`, and upload the files in this folder to its root. Keep `.pages.yml` (the hidden file) in the root too. Do not upload the ZIP itself as a single file.
2. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git** and select the repository. Use **Build command:** `node scripts/build.mjs`; **Build output directory:** `dist`; **Root directory:** repository root. Deploy to the temporary `*.pages.dev` address first.
3. Open [Pages CMS](https://app.pagescms.org/), sign in with GitHub, install its GitHub app for this repository, and open the repo. The editors for research cards, homepage events, publications, and team members appear automatically from `.pages.yml`.
4. Edit a publication title in Pages CMS, save it, and check that Cloudflare rebuilds the preview. Restore the title if it was only a test.
5. Before moving the domain, upload the three existing photos into `site/media/` (via Pages CMS) and replace their old WordPress URLs in the team editor and in the two page templates (`site/index.html` and `site/data-and-recording/index.html`). Confirm they appear on the Pages preview. These source images currently live on WordPress and would break if WordPress media were removed.
6. Once all pages and images work on the preview, add `ml4biodiversity.org` and `www.ml4biodiversity.org` as custom domains in Cloudflare Pages and follow its DNS instructions. Keep WordPress available until DNS and the new site are verified. Domain renewal is separate from free hosting.

## Editing later

- In Pages CMS, open **Publications**, **Research cards**, **Homepage events**, or **Team members**, make a change, and save. GitHub records the revision and Cloudflare builds the updated site.
- For page-specific text or layout, edit the corresponding `site/<page>/index.html` in GitHub's browser editor; `site/index.html` is the homepage. The CSS is `site/style.css`. The CMS covers the most frequently changing lists; long-form subpage text currently lives in HTML templates.
- Homepage events link to existing detail pages. Adding a new event to the CMS list does not create its detail page: copy an existing folder under `site/`, edit its `index.html`, and set the list item's URL to the new path. An external event URL also works.
- To preview locally, run `node scripts/build.mjs` and serve `dist/` with any local static server, such as `python -m http.server 8000 -d dist`.
- Do not edit generated `dist/` files as a source of truth. Build regenerates them from `site/` and `content/`.

## Contents

- `site/`: page templates and styling, including all six existing subpages.
- `content/*.json`: the four editable lists.
- `.pages.yml`: the Pages CMS editor configuration.
- `scripts/build.mjs`: dependency-free HTML generator with escaped content and validated links.
- `dist/`: built version for inspection; Cloudflare regenerates it on each commit.

## Publishing checklist

- Review 2026 event dates, paper acceptance status, team roles, and contact email before public launch.
- Check every link and image on the `*.pages.dev` preview, including narrow screens.
- Preserve access to the WordPress backup until the domain cutover is verified.
