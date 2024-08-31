import fs from "fs/promises";
import path from "path";
import chokidar from "chokidar";
import zlib from "zlib";
import { execSync } from "child_process";
import { debounce } from 'lodash';
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { marked } from "marked";
import * as emoji from 'node-emoji';
import * as prettier from "prettier";
import * as sass from "sass";
import { minify } from 'csso';
import figlet from "figlet";
import dedent from "dedent";
import chalk from "chalk";
import twemoji from "twemoji";
import pkg from "../package.json";

const OUTPUT_FOLDER = "./site";
const TEMPLATE_FILE = "./root.html";
const SRC_FOLDER = "./src";
const PAGES_FOLDER = path.join(SRC_FOLDER, "pages");
const PUBLIC_FOLDER = path.join(SRC_FOLDER, "public");
const BLOG_FOLDER = path.join(PAGES_FOLDER, "blog");

const { log } = console;
const errorLog = (msg: string) => log(chalk.red(msg));
const successLog = (msg: string) => log(chalk.green(msg));
const infoLog = (msg: string) => log(chalk.blue(msg));

const parseDateString = (dateString: string): Date => {
  // 00/00/0000
  const date = dateString.split(' ')[0]

  // 00:00:00
  const time = dateString.split(' ')[1] + dateString.split(' ')[2]

  const [day, month, year] = date.split('/');
  const [hour, minute, second] = time.split(':');
  

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
};

const getGitInfo = () => {
  try {
    const exec = (cmd: string) => execSync(cmd).toString().trim();
    return {
      commitHash: exec(`git rev-parse HEAD`),
      commitBranch: exec(`git rev-parse --abbrev-ref HEAD`),
      commitMessage: exec(`git log -1 --pretty=%B`),
      commitDate: exec(`git log -1 --pretty=%cd`)
    };
  } catch (error) {
    errorLog("Error getting Git info:");
    console.error(error);
    return { commitHash: "", commitMessage: "", commitBranch: "", commitDate: "" };
  }
};

const siteURL = "https://thinliquid.dev";

const generateRSSFeed = async () => {
  const blogPosts = await fs.readdir(BLOG_FOLDER);
  const parser = new XMLParser();

  const items = await Promise.all(blogPosts.map(async (file) => {
    const [frontMatter,] = (await fs.readFile(path.join(BLOG_FOLDER, file), 'utf-8')).split('---');
    const json = parser.parse(frontMatter);

    return {
      title: json.meta.title,
      description: json.meta.description,
      link: `${siteURL}/blog/${parseFilename(file)}`,
      pubDate: parseDateString(json.meta.date).toUTCString(),
      guid: `${siteURL}/blog/${parseFilename(file)}`,
    };
  }));

  const rssFeed = {
    rss: {
      "@@version": "2.0",
      channel: {
        title: "thinliquid's catppuccin heaven",
        link: siteURL,
        'atom:link': {
          '@@href': `${siteURL}/blog.xml`,
          '@@rel': 'self',
          '@@type': 'application/rss+xml',
        },
        description: "yuh i have an rss feed!!",
        lastBuildDate: new Date().toUTCString(),
        item: items.map(item => ({
          title: item.title,
          description: item.description,
          link: item.link,
          pubDate: item.pubDate === "Invalid Date" ? 'failed to get date' : item.pubDate,
          guid: item.guid,
        })),
      }
    }
  };

  const builder = new XMLBuilder({ format: true, ignoreAttributes: false, attributeNamePrefix: '@@' });
  const xmlContent = builder.build(rssFeed);
  await fs.writeFile(path.join(OUTPUT_FOLDER, "blog.xml"), dedent`
    <?xml-stylesheet type="text/xsl" href="/rss.xsl" ?>
    ${xmlContent}
  `);
  successLog("RSS feed generated successfully!");
};

const compileSCSSFiles = async (files: string | string[]): Promise<string> => {
  const compileFile = (file: string) => sass.compile(path.join(SRC_FOLDER, file)).css.toString();
  const result = Array.isArray(files) ? files.map(compileFile).join('') : compileFile(files);
  return minify(result).css;
};

const createExternalStyles = (files: string | string[]): string => Array.isArray(files)
? files.map(file => `<link rel="stylesheet" href="${file}">`).join('')
: `<link rel="stylesheet" href="${files}">`;

const parseEmojis = (markdown: string): string => {
  const emojify = (match: string) => twemoji.parse(emoji.emojify(match), {
    base: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/'
  });
  return markdown
    .replace(/<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g, m => m.replace(/:/g, '__colon__'))
    .replace(/:(\w+?):/gi, emojify)
    .replace(/__colon__/g, ':');
};

const parseFilename = (filename: string): string =>
  filename.replace(/\[.*\] /g, '').replaceAll(" ", "-").replace(".md", ".html");

const getBlogPosts = async (parser: XMLParser) => {
  const files = await fs.readdir(BLOG_FOLDER);
  return await Promise.all(files.map(async (file) => {
    const [frontMatter] = (await fs.readFile(path.join(BLOG_FOLDER, file), 'utf-8')).split('---');
    const json = parser.parse(frontMatter);
    return `
      <button class="big" onclick="window.location.href = '/blog/${parseFilename(file)}'" style="width:100%;padding:10px;text-align:left;--color:var(--${json.meta.color});">
        <h2 style="margin: 0;margin-bottom:5px;">${json.meta.title}</h2>
        <p style="margin:0;padding-bottom:5px;">${json.meta.description}</p>
        <small>${json.meta.date}</small>
      </button>`;
  }));
};

const colors = {
  "rosewater": "#f5e0dc",
  "flamingo": "#f2cdcd",
  "pink": "#f5c2e7",
  "mauve": "#cba6f7",
  "red": "#f38ba8",
  "maroon": "#eba0ac",
  "peach": "#fab387",
  "yellow": "#f9e2af",
  "green": "#a6e3a1",
  "teal": "#94e2d5",
  "sky": "#89dceb",
  "sapphire": "#74c7ec",
  "blue": "#89b4fa",
  "lavender": "#b4befd",
  "text": "#cdd6f4",
  "subtext1": "#bac2de",
  "subtext0": "#a6adc8",
  "overlay2": "#9399b2",
  "overlay1": "#7f849c",
  "overlay0": "#6c7086",
  "surface2": "#585b70",
  "surface1": "#45475a",
  "surface0": "#313244",
  "base": "#1e1e2e",
  "mantle": "#181924",
  "crust": "#11111b"
}

const formatPage = async (
  filename: string,
  data: string,
  rootTemplate: string,
  parser: XMLParser
): Promise<string> => {
  const [frontMatter, ...contentParts] = data.split('---');
  const json = parser.parse(frontMatter);
  let mdContent = parseEmojis(contentParts.join('---'));

  const { commitHash, commitMessage, commitDate } = getGitInfo();

  if (json.meta.type === 'blog post') {
    mdContent = dedent`
      # ${json.meta.title}
      <small>${json.meta.date} | ${json.meta.description}</small>
      <hr/>
      ${mdContent}`;
  }

  const [html, md, styles, externalStyles, blogPosts] = await Promise.all([
    rootTemplate,
    marked.parse(mdContent),
    compileSCSSFiles(json.meta['use-style'] ?? []),
    createExternalStyles(json.meta['use-external-style'] ?? []),
    getBlogPosts(parser)
  ]);

  const getNextInObj = (obj: any, key: string) => {
    const keys = Object.keys(obj);
    const index = keys.indexOf(key);
    if (index === -1) return null;
    return keys[index + 1];
  }

  const { default: nav } = require('../src/nav.ts')

  const page = html
    .replaceAll("{{ version }}", pkg.version)
    .replaceAll("{{ color }}", (colors as any)[json.meta.color ?? 'blue'])
    .replaceAll("| color-name |", json.meta.color ?? 'blue')
    .replaceAll("{{ color2 }}", (colors as any)[getNextInObj(colors, json.meta.color ?? 'blue') ?? 'blue'])
    .replaceAll("| color2-name |", getNextInObj(colors, json.meta.color ?? 'blue') ?? 'blue')
    .replaceAll("{{ title }}", filename.endsWith("index.md") ? '' : `${json.meta.title.toLowerCase()} | `)
    .replaceAll("{{ page-title }}", json.meta.title)
    .replaceAll("{{ description }}", json.meta.description)
    .replaceAll("{{ commit-hash }}", commitHash)
    .replace("{{ commit-hash-short }}", commitHash.slice(0, 7))
    .replace("{{ commit-message }}", commitMessage)
    .replace("{{ commit-date }}", new Date(commitDate).toUTCString())
    .replace("/* styles */", styles)
    .replace("{{ external-styles }}", externalStyles)
    .replace("{{ content }}", md)
    .replace("{{ blog-posts }}", blogPosts.join(''))
    .replace("{{ navigation }}", nav.map(({ title, link, emoji }: {
      title: string;
      link: string;
      emoji: string;
    }) => `<a href="${link}"><button>${parseEmojis(emoji)} ${title}</button></a>`).join(''));

  const beautified = await prettier.format(page, {
    parser: "html",
    htmlWhitespaceSensitivity: "ignore",
    printWidth: Infinity,
  });

  const comment = `<!--
${figlet.textSync("thinliquid.dev", { font: "Small Slant" })}
${dedent`
  this HTML file was generated from "${path.basename(filename)}" using my own SSG!
  check out the source code at: https://github.com/ThinLiquid/site
`}
-->\n`;

  return comment + beautified;
};

const processFile = async (file: string, rootTemplate: string, parser: XMLParser) => {
  try {
    const parsedFilename = parseFilename(file);
    const data = await fs.readFile(file, "utf-8");
    const formattedData = await formatPage(file, data, rootTemplate, parser);
    const brotliCompressedData = zlib.brotliCompressSync(formattedData);

    const outputFilePath = path.join(OUTPUT_FOLDER, path.relative(PAGES_FOLDER, parsedFilename));
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(`${outputFilePath}.br`, new Uint8Array(brotliCompressedData));
    await fs.writeFile(outputFilePath, formattedData);
    successLog(`Built ${file}`);
  } catch (e) {
    errorLog(`Error processing ${file}:`);
    console.error(e);
  }
};

const build = async () => {
  try {
    await fs.rm(OUTPUT_FOLDER, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_FOLDER, { recursive: true });

    const readFilesRecursively = async (dir: string): Promise<string[]> => {
      const list = await fs.readdir(dir, { withFileTypes: true });
      const results = await Promise.all(list.map(async (file) => {
        const filePath = path.join(dir, file.name);
        return file.isDirectory() ? readFilesRecursively(filePath) : filePath;
      }));
      return results.flat();
    };

    const files = await readFilesRecursively(PAGES_FOLDER);
    const parser = new XMLParser();
    const rootTemplate = await fs.readFile(TEMPLATE_FILE, "utf-8");

    generateRSSFeed()

    await Promise.all(files.map(file => file.endsWith(".md") ? processFile(file, rootTemplate, parser) : Promise.resolve()));

    await fs.cp(PUBLIC_FOLDER, OUTPUT_FOLDER, { recursive: true });
    successLog("Site built successfully!");
  } catch (e) {
    errorLog("Error during build:");
    console.error(e);
  }
};

infoLog("Building site...");
await build();

if (process.argv[2] === 'watch' || process.argv[2] === 'serve') {
  const debouncedBuild = debounce(build, 500);
  chokidar.watch([TEMPLATE_FILE, SRC_FOLDER]).on("all", debouncedBuild);

  if (process.argv[2] === 'serve') {
    const http = require('http');
    const handler = require('serve-handler');
    http.createServer((req: any, res: any) => handler(req, res, { public: OUTPUT_FOLDER })).listen(8080);
    successLog('Server running at http://localhost:8080/');
  }
}
