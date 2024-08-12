import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import zlib from "zlib";

import { XMLParser } from "fast-xml-parser";

import * as marked from "marked";
import * as prettier from "prettier";
import * as sass from "sass";
import { minify } from 'csso';

import figlet from "figlet";
import dedent from "dedent";

const OUTPUT_FOLDER = "./site";
const TEMPLATE_FILE = "./root.html";

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

const format = async (filename: string, data: string) => {
  const parser = new XMLParser();
  const [frontMatter, ...contentParts] = data.split('---');
  const json = parser.parse(frontMatter);
  const mdContent = contentParts.join('---');

  const [html, md] = await Promise.all([
    rootTemplate,
    marked.parse(mdContent)
  ]);

  const styles = await compileSCSSFiles(json.meta['use-style'] ?? []);
  const externalStyles = createExternalStyles(json.meta['use-external-style'] ?? []);

  const page = html
    .replace("/* styles */", styles)
    .replace("{{ external-styles }}", externalStyles)
    .replaceAll("{{ title }}", filename.endsWith("index.html") ? '' : `${json.meta.title} | `)
    .replaceAll("{{ page-title }}", json.meta.title)
    .replaceAll("{{ description }}", json.meta.description)
    .replace("{{ content }}", md);

  const beautified = await prettier.format(page, { parser: "html", htmlWhitespaceSensitivity: "ignore" });

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
    if (file.endsWith(".html")) {
      try {
        const data = await fs.promises.readFile(`./src/pages/${file}`, "utf-8");

        const formattedData = await format(file, data);
        const brotliCompressedData = zlib.brotliCompressSync(formattedData);

        const outputFilePath = path.join(OUTPUT_FOLDER, file);
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

if (process.argv[2] === 'watch') {
  fs.watch(TEMPLATE_FILE, async () => {
    console.log("Template file changed, reloading...");
    rootTemplate = fs.readFileSync(TEMPLATE_FILE, "utf-8");
    await build();
  })
  chokidar.watch("./src", { ignored: /^\./ }).on("all", async (event, file) => {
    console.log(`[UPDATE] ${file}`);
    await build()
  })
} else {
  await build()
}