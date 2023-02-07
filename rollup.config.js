import commonJs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' assert { type: 'json' };
const { name, homepage, version } = pkg;

const umdConf = {
  format: 'umd',
  extend: true,
  name: 'd3',
  banner: `// Version ${version} ${name} - ${homepage}`
};

export default {
  input: 'src/index.js',
  output: [
    { // umd
      ...umdConf,
      file: `dist/${name}.js`,
      sourcemap: true
    },
    { // minify
      ...umdConf,
      file: `dist/${name}.min.js`,
      plugins: [terser({
        output: { comments: '/Version/' }
      })]
    }
  ],
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    resolve(),
    commonJs()
  ]
};