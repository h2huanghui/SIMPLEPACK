const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');
const fs = require('fs');

module.exports = class Compiler {

  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = []; //存放：最终处理所有构建好的模块信息
  }

  run() {
    //获取entryModule
    const entryModule = this.buildModule(this.entry, true);
    //处理依赖函数
    this.modules.push(entryModule);
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency))
      })
    })
    console.log(this.modules);
    this.emitFiles(); //生成文件
  }

  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename); //绝对路径
    } else {
      let absolutePath = path.join(process.cwd(), './src', filename); //process.cwd()表示根目录，根目录到src,再到依赖文件的路径（相对路径），转换为绝对路径
      ast = getAST(absolutePath);
    }

    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    }

  }

  emitFiles() {
    //输出到哪里
    const outPath = path.join(this.output.path, this.output.filename);

    // 模块代码
    let modules = '';
    this.modules.map((_module) => {
      modules += `'${_module.filename}': function(require,module,exports) { ${_module.source} } ,`;
      //'"use strict";\n\nvar _greeting = require("./greeting.js");\n\ndocument.write((0, _greeting.greeting)(\'Hui\'));'
      // source 里面含有 require
    })

    const bundle = `(function(modules) {
      function require(filename) {
        var fn = modules[filename]; 
        var module = {exports: {}};
        fn(require,module,module.exports);
        return module.exports
      }
      require('${this.entry}')
    })({${modules}})`;
    // console.log('bundle', bundle);
    fs.writeFileSync(outPath, bundle, 'utf-8');
  }
}