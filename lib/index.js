/* 入口文件 */

const Compiler = require('./compiler');
const options = require('../simplepack.config');

const compiler = new Compiler(options);  //实例化Compiler

compiler.run();