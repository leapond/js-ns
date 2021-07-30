import serve from "rollup-plugin-serve";
import buble from "@rollup/plugin-buble";
import nodeResolve from "@rollup/plugin-node-resolve";
import leapondReplace from "leapond-rollup-plugin-replace"

const isDev = process.env.NODE_ENV !== 'production',
    pkg = require('./package.json')

export default {
  input: 'src/index.js',
  output: [
    {file: pkg.main, format: 'cjs', sourcemap: true, exports: 'auto'},
    {file: pkg.module, format: 'es', sourcemap: true},
    {file: pkg.borwser, format: 'iife', sourcemap: true, name: 'ns'}
  ],
  plugins: [
    nodeResolve(),
    isDev ? null : leapondReplace({LEAPOND: true}),
    isDev ? null : buble(),
    isDev ? serve('dist') : null
  ],
}
