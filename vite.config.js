import { defineConfig } from 'vite';
import { renameSync } from 'fs';
import { resolve } from 'path';

function renameIndexHtmlPlugin() {
  return {
    name: 'rename-index-html',
    closeBundle() {
      const buildDir = resolve(__dirname, 'site'); // Adjust if your output directory is different
      const indexPath = resolve(buildDir, 'index.html');
      const notFoundPath = resolve(buildDir, 'not_found.html');

      try {
        renameSync(indexPath, notFoundPath);
        console.log(`Renamed index.html to not_found.html in ${buildDir}`);
      } catch (error) {
        console.error('Failed to rename index.html:', error);
      }
    },
  };
}

export default defineConfig({
  plugins: [renameIndexHtmlPlugin()],
});
