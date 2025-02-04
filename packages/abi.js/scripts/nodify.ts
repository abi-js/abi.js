import { build, emptyDir } from 'jsr:@deno/dnt';
import pkg from '../package.json' with { type: 'json' };

const outDir = './tmp';
const distDir = './dist/deno';

await emptyDir(outDir);
await emptyDir(`${distDir}/deps`);
await emptyDir(`${distDir}/node_modules`);

await build({
  importMap: 'deno.json',
  typeCheck: false,
  test: false,
  declaration: false,
  sourceMap: false,
  minify: false,
  entryPoints: ['./dist/deno/mod.ts'],
  outDir,
  shims: false,
  package: pkg,
  async postBuild() {
    for await (const entryPoint of Deno.readDir(`${outDir}/src`)) {
      await Deno.rename(
        `${outDir}/src/${entryPoint.name}`,
        `${distDir}/${entryPoint.name}`,
      );
      console.log(
        '\x1b[32m',
        `🚚 ${outDir}/src/${entryPoint.name} -> ${distDir}/${entryPoint.name}`,
      );
    }
    await emptyDir(outDir);
  },
});
