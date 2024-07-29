import { defineConfig } from 'vite';
import { renameSync, rmSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

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



function gitCommitInfo() {
  return {
    name: 'vite-plugin-git-commit',
    config() {
      const commitHash = execSync('git rev-parse HEAD').toString().trim();
      const commitDate = execSync('git log -1 --format=%cd').toString().trim();

      return {
        define: {
          'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
          'import.meta.env.VITE_COMMIT_DATE': JSON.stringify(commitDate),
        },
      };
    },
  };
}


export default defineConfig({
  plugins: [renameIndexHtmlPlugin(), gitCommitInfo()],
});
