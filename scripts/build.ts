import fs from "fs/promises";
import path from "path";
import chokidar from "chokidar";
import zlib from "zlib";
import { execSync } from "child_process";
import { debounce } from 'lodash';
import { XMLParser } from "fast-xml-parser";
import { marked } from "marked";
import * as emoji from 'node-emoji';
import * as prettier from "prettier";
import * as sass from "sass";
import { minify } from 'csso';
import figlet from "figlet";
import dedent from "dedent";
import chalk from "chalk";

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

const getGitInfo = () => {
  try {
    const exec = (cmd: string) => execSync(cmd).toString().trim();
    return {
      commitHash: exec(`git rev-parse HEAD`),
      commitBranch: exec(`git rev-parse --abbrev-ref HEAD`),
      commitMessage: exec(`git log -1 --pretty=%B`),
    };
  } catch (error) {
    errorLog("Error getting Git info:");
    console.error(error);
    return { commitHash: "", commitMessage: "", commitBranch: "" };
  }
};

const compileSCSSFiles = async (files: string | string[]): Promise<string> => {
  const compileFile = (file: string) => sass.compile(path.join(SRC_FOLDER, file)).css.toString();
  const result = Array.isArray(files) ? files.map(compileFile).join('') : compileFile(files);
  return minify(result).css;
};

const createExternalStyles = (files: string | string[]): string => {
  return Array.isArray(files)
    ? files.map(file => `<link rel="stylesheet" href="${file}">`).join('')
    : `<link rel="stylesheet" href="${files}">`;
};

const parseEmojis = (markdown: string): string => {
  const emojify = (match: string) => `<span className="emoji">${emoji.emojify(match)}</span>`;
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
      <button onclick="window.location.href = '/blog/${parseFilename(file)}'" style="width:100%;padding:10px;text-align:left;">
        <h2>${json.meta.title}</h2>
        <p style="margin:0;padding-bottom:5px;">${json.meta.description}</p>
        <small>${json.meta.date}</small>
      </button>`;
  }));
};

const formatPage = async (
  filename: string,
  data: string,
  rootTemplate: string,
  parser: XMLParser
): Promise<string> => {
  const [frontMatter, ...contentParts] = data.split('---');
  const json = parser.parse(frontMatter);
  let mdContent = parseEmojis(contentParts.join('---'));

  const { commitHash, commitMessage } = getGitInfo();

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

  const page = html
    .replaceAll("{{ title }}", filename.endsWith("index.md") ? '' : `${json.meta.title.toLowerCase()} | `)
    .replaceAll("{{ page-title }}", json.meta.title)
    .replaceAll("{{ description }}", json.meta.description)
    .replace("{{ commit-hash }}", commitHash)
    .replace("{{ commit-hash-short }}", commitHash.slice(0, 7))
    .replace("{{ commit-message }}", commitMessage)
    .replace("/* styles */", styles)
    .replace("{{ external-styles }}", externalStyles)
    .replace("{{ content }}", md)
    .replace("{{ blog-posts }}", blogPosts.join(''));

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
    await fs.writeFile(`${outputFilePath}.br`, brotliCompressedData);
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
