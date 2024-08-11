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
  const json = parser.parse(data.split('---')[0]);

  const md = await marked.parse(
    data.split('---')
      .slice(1)
      .join('---')
  );

  const html = await rootTemplate;
  const page = html
    .replace("/* styles */", await compileSCSSFiles(json.meta['use-style'] ?? []))
    .replace("{{ external-styles }}", createExternalStyles(json.meta['use-external-style'] ?? []))
    .replaceAll("{{ title }}", filename.endsWith("index.html") ? '' : `${json.meta.title} | `)
    .replaceAll("{{ page-title }}", json.meta.title)
    .replaceAll("{{ description }}", json.meta.description)
    .replace("{{ content }}", md);

  const beautified = await prettier.format(page, { parser: "html", htmlWhitespaceSensitivity: "ignore" })
  const comment = `<!--
${figlet.textSync("thinliquid.dev", { font: "Small Slant" })}

${dedent`
  this file was generated from "${path.basename(filename)}" using a custom script!
  the source XML file can be found in the "src/pages" directory.

  check out the source code at: https://github.com/ThinLiquid/site
`}
-->\n`;

  return comment + beautified;
}

const initializeOutput = () => {
  fs.readdirSync(OUTPUT_FOLDER).forEach((file) => {
    fs.unlinkSync(path.join(OUTPUT_FOLDER, file));
  })
  fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

const build = async () => {
  initializeOutput();
  const files = fs.readdirSync("./src/pages/");

  try {
    for (const file of files) {
      if (file.endsWith(".html")) {
        const data = fs.readFileSync(`./src/pages/${file}`, "utf-8");
    

        fs.writeFileSync(path.join(OUTPUT_FOLDER, `${file}.br`), await zlib.brotliCompressSync(await format(file, data)));
        fs.writeFileSync(path.join(OUTPUT_FOLDER, file), await format(file, data));
      }
    }
  } catch (e) {
    console.error(e);
  }

  const publicFiles = fs.readdirSync("./src/public");
  for (const file of publicFiles) {
    fs.copyFileSync(`./src/public/${file}`, path.join(OUTPUT_FOLDER, file));
  }
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