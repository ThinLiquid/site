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
      commitMessage: exec(`git log -1 --pretty=%B`)
    };
  } catch (error) {
    errorLog("Error getting Git info:");
    console.error(error);
    return { commitHash: "", commitMessage: "", commitBranch: "" };
  }
};

const compileSCSSFiles = async (files: string | string[]): Promise<string> => {
  const compileFile = (file: string) => sass.compile(path.join('./src', file)).css.toString();
  const result = Array.isArray(files) ? files.map(compileFile).join('') : compileFile(files);
  return minify(result).css;
};

const createExternalStyles = (files: string | string[]): string => {
  return Array.isArray(files)
    ? files.map(file => `<link rel="stylesheet" href="${file}">`).join('')
    : `<link rel="stylesheet" href="${files}">`;
};

const parseEmojis = (markdown: string) => {
  const emojify = (match: string) => `<span className="emoji">${emoji.emojify(match)}</span>`;
  return markdown.replace(/<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g, m => m.replace(/:/g, '__colon__'))
    .replace(/:(\w+?):/gi, emojify)
    .replace(/__colon__/g, ':');
};

const format = async (filename: string, data: string) => {
  const parser = new XMLParser();
  const [frontMatter, ...contentParts] = data.split('---');
  const json = parser.parse(frontMatter);
  let mdContent = parseEmojis(contentParts.join('---'));
  const { commitHash, commitMessage } = getGitInfo();

  const pageType = json.meta.type ?? 'page';

  if (pageType === 'blog post') {
    mdContent = dedent`
      # ${json.meta.title}
      <small>${json.meta.date} | ${json.meta.description}</small>
      <hr/>
      ${mdContent}`;
  }

  const [html, md] = await Promise.all([
    rootTemplate,
    marked.parse(mdContent)
  ]);

  const styles = await compileSCSSFiles(json.meta['use-style'] ?? []);
  const externalStyles = createExternalStyles(json.meta['use-external-style'] ?? []);

  const page = html
    .replaceAll("{{ modfile }}", json.meta.modfile ?? 'gemini-bleeps.mod')
    .replaceAll("{{ title }}", filename.endsWith("index.md") ? '' : `${json.meta.title} | `)
    .replaceAll("{{ page-title }}", json.meta.title)
    .replaceAll("{{ description }}", json.meta.description)
    .replace("{{ commit-hash }}", commitHash)
    .replace("{{ commit-hash-short }}", commitHash.slice(0, 7))
    .replace("{{ commit-message }}", commitMessage)
    .replace("/* styles */", styles)
    .replace("{{ external-styles }}", externalStyles)
    .replace("{{ content }}", md)
    .replace("{{ blog-posts }}", await (await fs.readdir('./src/pages/blog')
      .then(async (files) => await Promise.all(files.map(async (file) => {
        const [frontMatter] = (await fs.readFile(`./src/pages/blog/${file}`, 'utf-8')).split('---');
        const json = parser.parse(frontMatter);
        return `
        <button onclick="window.location.href = '/blog/${parseFilename(file)}'" style="width:100%;padding:10px;text-align:left;">
          <h2>${json.meta.title}</h2>
          <p style="margin:0;padding-bottom:5px;">${json.meta.description}</p>
          <small>${json.meta.date}</small>
        </button>`;
      })))).join(''));

  const beautified = await prettier.format(page, { parser: "html", htmlWhitespaceSensitivity: "ignore", printWidth: Infinity });

  const comment = `<!--
${figlet.textSync("thinliquid.dev", { font: "Small Slant" })}

${dedent`
  this file was generated from "${path.basename(filename)}" using my own SSG!
  the source file can be found in the "src/pages" directory.

  check out the source code at: https://github.com/ThinLiquid/site
`}
-->\n`;

  return comment + beautified;
};

const parseFilename = (filename: string) => filename.replace(/\[.*\] /g, '').replaceAll(" ", "-").replace(".md", ".html");

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

    const files = await readFilesRecursively("./src/pages/");

    await Promise.all(files.map(async (file) => {
      if (file.endsWith(".md")) {
        try {
          const parsedFilename = parseFilename(file);
          const data = await fs.readFile(file, "utf-8");
          const formattedData = await format(file, data);
          const brotliCompressedData = zlib.brotliCompressSync(formattedData);

          const outputFilePath = path.join(OUTPUT_FOLDER, path.relative("./src/pages", parsedFilename));
          await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
          await fs.writeFile(`${outputFilePath}.br`, brotliCompressedData);
          await fs.writeFile(outputFilePath, formattedData);
          successLog(`Built ${file}`);
        } catch (e) {
          errorLog(`Error processing ${file}:`);
          console.error(e);
        }
      }
    }));

    await fs.cp('./src/public', OUTPUT_FOLDER, { recursive: true });
    successLog("Site built successfully!");
  } catch (e) {
    errorLog("Error during build:");
    console.error(e);
  }
};

let rootTemplate = await fs.readFile(TEMPLATE_FILE, "utf-8");
await fs.mkdir(OUTPUT_FOLDER, { recursive: true });

infoLog("Building site...");
console.log();

const debouncedBuild = debounce(async () => {
  infoLog('Building...');
  rootTemplate = await fs.readFile(TEMPLATE_FILE, "utf-8");
  await build();
}, 500);

await build();

if (process.argv[2] === 'watch' || process.argv[2] === 'serve') {
  chokidar.watch(TEMPLATE_FILE).on("change", debouncedBuild);
  chokidar.watch("./src").on("all", debouncedBuild);

  if (process.argv[2] === 'serve') {
    const http = require('http');
    const handler = require('serve-handler');

    http.createServer((req: any, res: any) => handler(req, res, { public: OUTPUT_FOLDER })).listen(8080);
    successLog('Server running at http://localhost:8080/');
  }
}