// ES6 支持 （import，class等）
require("babel-core/register")({  
    presets: ['env', 'stage-0']
});
require("babel-polyfill");   //引入这个文件babel-polyfill很重要，否则出现错误

const Koa = require('koa')
// import constants from './app/utils/response/constants'
// import Koa from 'Koa'
const bodyParser = require('koa-bodyparser')
const app = new Koa()
// import {router} from './router'
const router = require('./router');

app.use(bodyParser());

router(app);
 

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})