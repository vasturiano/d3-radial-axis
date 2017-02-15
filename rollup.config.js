import commonJs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    dest: 'dist/d3-radial-axis.js',
    format: 'umd',
    moduleName: 'd3', //'RadialAxis',
    plugins: [
        commonJs(),
        nodeResolve({
            jsnext: true,
            main: true
        })
    ]
};