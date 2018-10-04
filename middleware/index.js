// const nunjucks = require('koa-nunjucks-2')
// const staticFiles = require('koa-static')
// const path = require('path')

import bodyParser from 'koa-bodyparser'
// const bodyParser = require('koa-bodyparser')
import miSend from  './mi-send'
// const miSend = require('./mi-send')


module.exports = (app) => {
    //载入中间件

    //   app.use(staticFiles(path.resolve(__dirname, "../public")))

//模版引擎nunjucks
//   app.use(nunjucks({
//     ext: 'html',
//     path: path.join(__dirname, '../views'),
//     nunjucksConfig: {
//       trimBlocks: true
//     }
//   }));

  //载入 bodyparser中间件
  app.use(bodyParser())
  //载入misend中间件
  app.use(miSend())
}