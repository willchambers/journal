import { HtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import yaml from "js-yaml";
import { readFileSync } from "node:fs";

// This is a GitHub project site, served at https://willchambers.github.io/journal/.
// Every root-relative URL in the built HTML gets the /journal/ prefix from
// HtmlBasePlugin, so templates and posts keep writing "/assets/…".
const site = yaml.load(readFileSync("src/_data/site.yml", "utf8"));

export default function (eleventyConfig) {
  // _data/*.yml, so the CMS and hand edits both use YAML.
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Files served as they are. The design system is a synced copy (sync-jewel.ps1);
  // jewel-candidates holds the components this site uses that Jewel doesn't have yet.
  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets",
    "admin": "admin",
    "jewel": "jewel",
    "jewel-candidates": "jewel-candidates",
  });

  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Every <img> in the built pages gets resized copies and a srcset. One format
  // keeps the output a plain <img> (no <picture>), so Jewel's selectors still match.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp"],
    widths: [480, 960, 1600, 2400],
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "en",
      title: site.title,
      subtitle: site.description,
      // The plugin adds pathPrefix itself, so the base is the bare origin.
      base: `${site.url}/`,
      author: { name: site.author },
    },
  });

  // ---- Collections (oldest first, like Eleventy's own; templates reverse) ----
  const byDate = (a, b) => a.date - b.date;
  eleventyConfig.addCollection("posts", (api) => api.getFilteredByGlob("src/posts/*.md").sort(byDate));

  // ---- Filters --------------------------------------------------------------
  eleventyConfig.addFilter("newest", (items = [], limit) => {
    const list = [...items].reverse();
    return limit ? list.slice(0, limit) : list;
  });

  const toDate = (d) => (d instanceof Date ? d : new Date(d));
  eleventyConfig.addFilter("readableDate", (d) =>
    toDate(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  );
  eleventyConfig.addFilter("shortDate", (d) =>
    toDate(d).toLocaleDateString("en-US", { year: "numeric", month: "short", timeZone: "UTC" }),
  );
  eleventyConfig.addFilter("isoDate", (d) => toDate(d).toISOString());

  eleventyConfig.addFilter("readingTime", (html = "") => {
    const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  });

  // 3 → "03", for index-list numbers.
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  return {
    pathPrefix: site.base,
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
