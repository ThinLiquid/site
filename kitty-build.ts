import { execSync } from 'child_process';
import * as esbuild from 'esbuild';
import fs from "fs";
import * as minifier from "html-minifier";
import { importFromString } from 'module-from-string';
import path from "path";
import * as sass from "sass";

// Read the base HTML template
const containerHTML = fs.readFileSync("./index.html", "utf8");

// Create the dist directory if it doesn't exist
if (fs.existsSync('./site')) fs.rmdirSync('./site', { recursive: true });
fs.mkdirSync('./site');

// Function to copy files from one directory to another
const copyFiles = (dir: string) => {
  fs.readdirSync(dir).forEach(file => {
    const isDir = fs.lstatSync(`${dir}/${file}`).isDirectory();
    if (isDir) {
      copyFiles(`${dir}/${file}`);
      return;
    }
    if (!fs.existsSync(`./site${dir.replace('./public', '')}`)) {
      fs.mkdirSync(`./site${dir.replace('./public', '')}`, { recursive: true });
    }
    fs.copyFileSync(`${dir}/${file}`, `./site${dir.replace('./public', '')}/${file}`);
  });
};

const __dirname = fs.realpathSync('.');

const js2dataUrl = async (file: string) => {
  const data = fs.readFileSync(file, 'utf8');
  const result = await esbuild.transform(data, { loader: 'ts', format: 'esm' });
  return result.code;
}

const removeImportsAndExports = (code: string) => {
  return code
    .replace(/^\s*import\s.*;\s*$/gm, '')
    .replace(/^\s*(export\s.*;\s*)|(\bexport\s.*\s*{[^}]*}\s*;\s*)|(\bexport\s+default\s+[^;]*\s*;\s*)|(\bexport\s+\{[^}]*\}\s*;\s*)$/gm, '')
}

const getAllExports = (module: any) => {
  const exports: Record<string, any> = {};
  for (const key in module) {
    if (key !== 'default' && key !== 'onRender' && key !== 'styles') {
      exports[key] = module[key];
    }
  }
  return exports;
}

// Process TypeScript files in the src/pages directory
fs.readdirSync("./src/pages").forEach(async (file) => {
  if (file.endsWith(".ts")) {
    const moduleCode = await js2dataUrl(`./src/pages/${file}`);

    const module = await importFromString(moduleCode, {
      dirname: __dirname + '/src/pages',
    });

    // Capture the default export, onRender, and all other exports
    const { default: n, onRender, styles } = module;
    const otherExports = getAllExports(module);

    const modifiedFilename = file.replace('.ts', '.html');

    // Serialize the onRender function and other exports
    const onRenderString = 'const onRender = ' + onRender.toString();
    const otherExportsString = Object.entries(otherExports)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `let ${key} = ${JSON.stringify(value)};`;
        } else if (typeof value === 'function') {
          return `let ${key} = ${value.toString()};`;
        } else if (value && typeof value === 'object' && value.element) {
          // This is likely a Kitty component
          return `let ${key} = new Kitty('${value.element.tagName.toLowerCase()}', {}, '${value.uuid}');`;
        } else {
          return `let ${key} = ${JSON.stringify(value)};`;
        }
      })
      .join('\n');

    // Read and compile the SCSS file
    let styleCSS = sass.compile('./src/style.scss').css.toString();

    for (const style in styles) {
      styleCSS += sass.compile(path.join('./src/pages/', styles[style])).css.toString();
    }

    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    const commitDate = execSync('git log -1 --format=%cd').toString().trim();

    // Replace placeholders in the HTML template
    const fileContent = containerHTML
      .replace('{{ site }}', n.element.outerHTML)
      .replace('{{ scripts }}', `
        window.env = {
          COMMIT_HASH: ${JSON.stringify(commitHash)},
          COMMIT_DATE: ${JSON.stringify(commitDate)}
        };
        ${removeImportsAndExports(await js2dataUrl('./kitty-ssg/lib/Kitty.ts'))}
        ${removeImportsAndExports(await js2dataUrl('./kitty-ssg/lib/Components.ts'))}
        ${otherExportsString.replace(/import_kitty_ssg.default/g, 'Kitty').replace(/import_kitty_ssg\./g, '')}
        ${onRenderString.replace(/import_kitty_ssg.default/g, 'Kitty').replace(/import_kitty_ssg\./g, '')}
        onRender();
      `)
      .replace('{{ styles }}', styleCSS);

    // Write the modified HTML content to the dist directory
    fs.writeFileSync(`./site/${modifiedFilename}`, minifier.minify(fileContent, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    }));
  }
});

// Copy static files from the public directory to dist
copyFiles('./public/');
