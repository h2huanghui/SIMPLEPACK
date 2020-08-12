
## 项目结构

```
├─package.json
├─README.md
├─simplepack.config.js  //simplepack配置
├─test.md
├─src  //项目代码
|  ├─greeting.js
|  └index.js

├─lib   //simplepack代码
|  └index.js     //入口文件
|  └parser.js    //解析AST语法树,同时将AST转换成代码(ES6=>ES5),分析依赖
|  └compiler.js  //文件构建和输出
|  └test.js      //测试parser里面的方法
```