# Journal

Will Chambers's journal, built on the [Jewel design system](https://github.com/willchambers/jewel-design-system). A static site made with [Eleventy](https://www.11ty.dev/), served by GitHub Pages at **https://willchambers.github.io/journal/**.

It's a GitHub *project* site, so every URL lives under `/journal/`. Posts and templates write plain root paths (`/assets/uploads/…`), and the build adds the prefix (`HtmlBasePlugin` in `eleventy.config.js`).

```
src/
  index.liquid          the post list (/journal/)
  posts/                posts (Markdown); each is served at /journal/<slug>/
  assets/uploads/       images used in posts
  _data/site.yml        title, URL and base path (edit by hand)
  _data/profile.yml     headline and intro (edit in /admin)
admin/                  Sveltia CMS
jewel/                  synced copy of the design system; don't edit here
jewel-candidates/       components Jewel doesn't have yet (copies; see willchambers.github.io's GAPS.md)
```

`/journal/feed.xml` is an Atom feed of the latest 20 posts. Every push to `main` (including CMS saves) builds and deploys in about a minute.

## Writing posts

Go to https://willchambers.github.io/journal/admin/ and choose **Sign In with Token**. The token is a fine-grained GitHub token with access to `willchambers/journal`, **Contents: Read and write**. Keep it in the browser only; never commit it.

## Working locally

```bash
npm install
npm start
```

Then open http://localhost:8082/journal/.

## Updating the design system

```bash
npm run sync-jewel
```

Copies Jewel's last pushed commit into `jewel/` (`-- -Ref <commit>` for a particular one). Then commit.
