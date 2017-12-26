import node from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import pkg from './package.json'

export default {
  plugins: [
    node(),
    flow(),
    babel({
      plugins: ['transform-object-rest-spread']
    }),
    uglify({}, minify)
  ],
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'iife',
    sourcemap: true
  }
}
