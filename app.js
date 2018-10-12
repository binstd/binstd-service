// ES6 支持 （import，class等）
require("babel-core/register")({  
    presets: ['env', 'stage-0']
});
require("babel-polyfill");   //引入这个文件babel-polyfill很重要，否则出现错误

const Koa = require('koa')
const app = new Koa()
const router = require('./router');
console.log('\n \n env: \n',app.env);
// console.log('The value of PORT is:', process.env.PORT);
//加载中间件
const middleware = require('./middleware')
middleware(app)

router(app);
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})