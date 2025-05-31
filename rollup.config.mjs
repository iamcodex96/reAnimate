import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

export default [
  // CommonJS and ESM builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'auto' // Let Rollup determine the best exports mode
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true
      },
    ],
    plugins: [
      nodeResolve(),
      typescript({ 
        tsconfig: './tsconfig.json',
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'node'
        }
      }),
    ],
    external: ['rxjs']
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];