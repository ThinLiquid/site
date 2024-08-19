import fs from "fs";
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

const log = console.log;
const errorLog = (msg: string) => log(chalk.red(msg));
const successLog = (msg: string) => log(chalk.green(msg));
const infoLog = (msg: string) => log(chalk.blue(msg));

const getGitInfo = () => {
  try {
    const commitHash = execSync(`git rev-parse HEAD`).toString().trim();
    const commitBranch = execSync(`git rev-parse --abbrev-ref HEAD`).toString().trim();
    const commitMessage = execSync(`git log -1 --pretty=%B`).toString().trim();
    return { commitHash, commitMessage, commitBranch };
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
  if (Array.isArray(files)) {
    return files.map(file => `<link rel="stylesheet" href="${file}">`).join('');
  }
  return `<link rel="stylesheet" href="${files}">`;
};

const parseEmojis = (markdown: string) => {
  const emojify = (match: string) => `<span className="emoji">${emoji.emojify(match)}</span>`;
  return markdown.replace(
    /<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g,
    (m) => m.replace(/:/g, '__colon__')
  )
  .replace(/:(\w+?):/gi, emojify)
  .replace(/__colon__/g, ':');
};

const format = async (filename: string, data: string) => {
  const parser = new XMLParser();
  const [frontMatter, ...contentParts] = data.split('---');
  const json = parser.parse(frontMatter);
  const mdContent = parseEmojis(contentParts.join('---'));
  const { commitHash, commitMessage } = getGitInfo();

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
    .replace("{{ content }}", md);

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

const build = async () => {
  try {
    fs.rmSync(OUTPUT_FOLDER, { recursive: true, force: true });
    fs.mkdirSync(OUTPUT_FOLDER);

    const files = fs.readdirSync("./src/pages/");

    for (const file of files) {
      if (file.endsWith(".md")) {
        try {
          const data = await fs.promises.readFile(`./src/pages/${file}`, "utf-8");
          const formattedData = await format(file, data);
          const brotliCompressedData = zlib.brotliCompressSync(formattedData);

          const outputFilePath = path.join(OUTPUT_FOLDER, file.replace(".md", ".html"));
          await fs.promises.writeFile(`${outputFilePath}.br`, brotliCompressedData);
          await fs.promises.writeFile(outputFilePath, formattedData);
          successLog(`Built ${file}`);
        } catch (e) {
          errorLog(`Error processing ${file}:`);
          console.error(e);
        }
      }
    }

    fs.cpSync('./src/public', OUTPUT_FOLDER, { recursive: true });
    successLog("Site built successfully!");
  } catch (e) {
    errorLog("Error during build:");
    console.error(e);
  }
};

let rootTemplate = fs.readFileSync(TEMPLATE_FILE, "utf-8");
fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });

infoLog("Building site...");
console.log();

const debouncedBuild = debounce(async () => {
  infoLog('Building...');
  rootTemplate = fs.readFileSync(TEMPLATE_FILE, "utf-8");
  await build();
}, 500);

await build();

if (process.argv[2] === 'watch') {
  chokidar.watch(TEMPLATE_FILE).on("change", async () => {
    debouncedBuild();
  });
  chokidar.watch("./src").on("all", async () => {
    debouncedBuild();
  });
} else if (process.argv[2] === 'serve') {
  chokidar.watch(TEMPLATE_FILE).on("change", async () => {
    debouncedBuild();
  });
  chokidar.watch("./src").on("all", async () => {
    debouncedBuild();
  });

  const http = require('http');
  const handler = require('serve-handler');

  http.createServer((req: any, res: any) => {
    return handler(req, res, { public: OUTPUT_FOLDER });
  }).listen(8080);

  successLog('Server running at http://localhost:8080/');
}