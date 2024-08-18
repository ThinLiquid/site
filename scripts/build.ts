import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import zlib from "zlib";
import { execSync } from "child_process";
import { debounce } from 'lodash';

import { XMLParser } from "fast-xml-parser";

import { marked } from "marked";
import * as emoji from 'node-emoji'
import * as prettier from "prettier";
import * as sass from "sass";
import { minify } from 'csso';

import figlet from "figlet";
import dedent from "dedent";

const OUTPUT_FOLDER = "./site";
const TEMPLATE_FILE = "./root.html";

const getGitInfo = () => {
  try {
    const commitHash = execSync(`git rev-parse HEAD`).toString().trim();
    const commitBranch = execSync(`git rev-parse --abbrev-ref HEAD`).toString().trim();
    const commitMessage = execSync(`git log -1 --pretty=%B`).toString().trim();
    return { commitHash, commitMessage, commitBranch };
  } catch (error) {
    console.error("Error getting Git info:", error);
    return { commitHash: "", commitMessage: "", commitBranch: "" };
  }
}

const compileSCSSFiles = async (files: string | string[]): Promise<string> => {
  let result = "";
  if (Array.isArray(files)) {
    for (const file of files) {
      result += sass.compile(path.join('./src', file)).css.toString();
    }
  } else {
    result = sass.compile(path.join('./src', files)).css.toString();
  }
  return minify(result).css;
}

const createExternalStyles = (files: string | string[]): string => {
  let result = "";
  if (Array.isArray(files)) {
    for (const file of files) {
      result += `<link rel="stylesheet" href="${file}">`;
    }
  } else {
    return `<link rel="stylesheet" href="${files}">`;
  }
  return result;
}

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
  const { commitHash, commitBranch, commitMessage } = getGitInfo();

  const [html, md] = await Promise.all([
    rootTemplate,
    marked.parse(mdContent)
  ]);

  const styles = await compileSCSSFiles(json.meta['use-style'] ?? []);
  const externalStyles = createExternalStyles(json.meta['use-external-style'] ?? []);

  const page = html
    .replace("/* styles */", styles)
    .replace("{{ external-styles }}", externalStyles)
    .replaceAll("{{ title }}", filename.endsWith("index.md") ? '' : `${json.meta.title} | `)
    .replaceAll("{{ page-title }}", json.meta.title)
    .replaceAll("{{ description }}", json.meta.description)
    .replace("{{ content }}", md)
    .replaceAll("{{ commit-hash }}", commitHash)
    .replaceAll("{{ commit-hash-short }}", commitHash.slice(0, 7))
    .replaceAll("{{ commit-branch }}", commitBranch)
    .replaceAll("{{ commit-message }}", commitMessage)
    .replace("{{ modfile }}", json.meta.modfile ?? 'gemini-bleeps.mod')

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
}

const build = async () => {
  fs.rmSync(OUTPUT_FOLDER, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_FOLDER);

  const files = fs.readdirSync("./src/pages/");

  files.forEach(async (file) => {
    if (file.endsWith(".md")) {
      try {
        const data = await fs.promises.readFile(`./src/pages/${file}`, "utf-8");

        const formattedData = await format(file, data);
        const brotliCompressedData = zlib.brotliCompressSync(formattedData);

        const outputFilePath = path.join(OUTPUT_FOLDER, file.replace(".md", ".html"));
        await fs.promises.writeFile(`${outputFilePath}.br`, brotliCompressedData);
        await fs.promises.writeFile(outputFilePath, formattedData);
      } catch (e) {
        console.error(e);
      }
    }
  });

  fs.cpSync('./src/public', OUTPUT_FOLDER, { recursive: true });
}

let rootTemplate = fs.readFileSync(TEMPLATE_FILE, "utf-8");
fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });

console.log("Building site...");
console.log()

const debouncedBuild = debounce(async () => {
  console.log('Building...');
  rootTemplate = fs.readFileSync(TEMPLATE_FILE, "utf-8");
  await build();
}, 500);

await build()
if (process.argv[2] === 'watch') {
  chokidar.watch(TEMPLATE_FILE).on("change", async (event, file) => {
    debouncedBuild()
  })
  chokidar.watch("./src").on("all", async (event, file) => {
    debouncedBuild()
  })
}