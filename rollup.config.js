import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'lib/index.ts',

  output: {
    dir: 'dist',
    sourcemap: true,
  },
  plugins: [nodeResolve(), typescript()],
};
