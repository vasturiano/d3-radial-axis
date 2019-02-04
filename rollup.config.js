import commonJs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { name, homepage, version } from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'umd',
      extend: true,
      name: 'd3',
      file: `dist/${name}.js`,
      sourcemap: true,
      banner: `// Version ${version} ${name} - ${homepage}`
    }
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonJs()
  ]
};