// const nunjucks = require('koa-nunjucks-2')
// const staticFiles = require('koa-static')
// const path = require('path')


import bodyParser from 'koa-bodyparser'
// const bodyParser = require('koa-bodyparser')
import Send from  './send-json'
// const miSend = require('./mi-send')

// 引入日志中间件
// const miLog = require('./log')
import Log from './log'
import ip from 'ip'
import apiError from './api-error' 
module.exports = (app) => {

    //载入中间件
     // 日志中间件
    app.use(Log({
            env: app.env,  // koa 提供的环境变量
            projectName: 'koa2-tutorial',
            appLogLevel: 'debug',
            dir: 'logs',
            serverIp: ip.address()
    }))
    //   app.use(staticFiles(path.resolve(__dirname, "../public")))

//模版引擎nunjucks
//   app.use(nunjucks({
//     ext: 'html',
//     path: path.join(__dirname, '../views'),
//     nunjucksConfig: {
//       trimBlocks: true
//     }
//   }));

 
    //载入send中间件
    app.use(Send()); 
    app.use(apiError());
  
  //载入 bodyparser中间件
  app.use(bodyParser());

 
  
}