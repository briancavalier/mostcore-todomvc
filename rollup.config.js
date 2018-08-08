import node from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import pkg from './package.json'

export default {
  plugins: [
    node({
      browser: true,
      main: true
    }),
    commonjs({
      namedExports: {
        'node_modules/react/index.js': ['createElement'],
        'node_modules/react-dom/index.js': ['render']
      },
      exclude: 'node_modules/process-es6/**',
      include: [
        'node_modules/create-react-class/**',
        'node_modules/fbjs/**',
        'node_modules/object-assign/**',
        'node_modules/react/**',
        'node_modules/react-dom/**',
        'node_modules/prop-types/**'
      ]
    }),
    babel({
      babelrc: false,
      presets: [
        ['@babel/env', { modules: false }],
        '@babel/flow',
        '@babel/react'
      ],
      plugins: [
        '@babel/proposal-object-rest-spread'
      ]
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    uglify({}, minify)
  ],
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'iife',
    sourcemap: true
  }
}
