import { readdir, rmdir, mkdir, stat, cp } from 'fs/promises'
import path from 'path'

type Variables = Record<string, string | (
  (...args: {
    [key: string]: any
  }[]) => string | Promise<string>
)>

interface Plugin {
  name: string
  setup: (api: { _: API }) => void
  variables?: Variables
}

interface Config {
  srcDirectory: string
  outputDirectory: string
  publicDirectory: string
  plugins: Plugin[]
  watch?: string[]
}

interface FilterOutput {
  code: string
  newExtension?: string
  directoryPrefix?: string,
  filenameHandler?: (filename: string) => string
  otherOutputs?: {
    encode: (code: string) => string | Buffer | Promise<string | Buffer>
    extension: string
  }[]
}

interface API {
  addFilter: (name: string, fn: FilterFunction) => void
  variables: Variables
}

type FilterFunction = (code: string, filename: string) => FilterOutput | Promise<FilterOutput>
const filters: Map<string, FilterFunction> = new Map()

const build = async () => {
  const modulePath = require.resolve('./ssg.config.ts');
  delete require.cache[modulePath];

  const config = (await import('./ssg.config.ts')).default as Config

  await rmdir(config.outputDirectory, { recursive: true })
  await mkdir(config.outputDirectory)

  console.log('Building...')

  config.plugins.forEach(async plugin => {
    plugin.setup({
      _: {
        addFilter: (name: string, fn: FilterFunction) => {
          filters.set(name, fn)
        },
        variables: plugin.variables ?? {}
      }
    })
  })

  console.log(`Loaded up ${filters.size} filters`)
  
  const srcDir = await readdir(config.srcDirectory, { recursive: true })

  for (const file of srcDir) {
    const realPath = path.join(config.srcDirectory, file)

    if ((await stat(realPath)).isDirectory()) {
      await mkdir(realPath, { recursive: true })
      continue
    }

    
    const fileContent = await Bun.file(realPath).text()

    const extname  = path.extname(file)

    if (filters.has(extname)) {
      const filter = filters.get(extname)!
      const { code, directoryPrefix, newExtension, filenameHandler, otherOutputs } = await filter(fileContent, realPath)

      let outPath = path.join(config.outputDirectory, file)

      if (directoryPrefix != null) {
        const [first, ...rest] = path.dirname(file).split('/')
        let filename = file.split('/').pop()!
        if (filenameHandler != null) {
          filename = filenameHandler(filename)
        }
        outPath = path.join(config.outputDirectory, first, directoryPrefix!, ...rest, filename)
      } else if (filenameHandler != null) {
        outPath = path.join(config.outputDirectory, path.dirname(file), filenameHandler(path.basename(file)))
      }
      
      
      if (newExtension != null) {
        outPath = outPath.replace(extname, newExtension)
      }

      console.log(`Writing to ${outPath}`)

      await Bun.write(outPath, code)

      if (otherOutputs != null) {
        for (const { encode, extension } of otherOutputs) {
          const outPath = path.join(config.outputDirectory, file.replace(extname, extension))
          console.log(`Writing to ${outPath}`)
          await Bun.write(outPath, await encode(code) as string)
        }
      }
    }
  }

  await cp(config.publicDirectory, config.outputDirectory, { recursive: true })
}

export const defineConfig = (config: Config) => config

if (process.argv[2] === 'build') {
  build()
} else if (process.argv[2] === 'watch' || process.argv[2] === 'serve') {
  const { default: ssgConfig} = await import('./ssg.config.ts')

  const { debounce } = await import('lodash')
  const chokidar = await import('chokidar')
  
  const debouncedBuild = debounce(build, 500);
  chokidar.watch([ssgConfig.srcDirectory, ...ssgConfig.watch ?? []]).on("all", debouncedBuild);
  
  if (process.argv[2] === 'serve') {
    const http = require('http');
    const handler = require('serve-handler');
    http.createServer((req: any, res: any) => handler(req, res, {
      public: ssgConfig.outputDirectory,
      headers: {
        'Accept-Encoding': 'gzip, compress, br'
      }
    })).listen(8080);
    console.log('Listening on http://localhost:8080');
  }
}