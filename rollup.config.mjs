import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

// Define the directories we want to build as separate modules
const modules = [
  'core',
  'easings',
  'presets',
  'utils',
  'types'
];

// Create the base configuration for the main bundle
const mainBundle = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
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
        moduleResolution: 'node',
        declaration: false, // Don't generate declarations with the JS build
        declarationDir: undefined
      }
    }),
  ],
  external: ['rxjs']
};

// Generate configurations for each module's JavaScript bundle
const moduleJSConfigs = modules.map(module => ({
  input: `src/${module}/index.ts`,
  output: [
    {
      file: `dist/${module}/index.js`,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    {
      file: `dist/${module}/index.mjs`,
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
        moduleResolution: 'node',
        declaration: false, // Don't generate declarations with the JS build
        declarationDir: undefined
      }
    }),
  ],
  external: ['rxjs', ...modules.map(m => `../${m}`)]
}));

// Separate configs for type definitions
const mainDts = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es'
  },
  plugins: [dts()],
};

const moduleDtsConfigs = modules.map(module => ({
  input: `src/${module}/index.ts`,
  output: {
    file: `dist/${module}/index.d.ts`,
    format: 'es'
  },
  plugins: [dts()],
}));

// Export all configurations
export default [
  // First build all JS files
  mainBundle,
  ...moduleJSConfigs,
  // Then build all declaration files
  mainDts,
  ...moduleDtsConfigs
];