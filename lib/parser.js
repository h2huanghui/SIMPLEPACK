
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {
  //生成AST语法树
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8'); //同步读取文件，utf-8格式
    return babylon.parse(source, {
      sourceType: 'module'
    })
  },
  //获取依赖
  getDependencies: (ast) => {
    const devpendencies = [];

    traverse(ast, {
      //分析import语句
      ImportDeclaration: ({ node }) => {
        devpendencies.push(node.source.value); //依赖内容
      }
    });

    return devpendencies;
  },

  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env'] //ES2015,2016,2017语法都可以进行解析
    })

    return code
  }
}