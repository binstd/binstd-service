var util = require('util');
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const index = require('./app/index')
const api = require('./app/api')
const ethapi = require('./app/ethapi')
var serve = require('koa-static');
var cors = require('koa2-cors');
// const ethapi = require('./app/utils/')

import {
    CustomError,
    HttpError
} from './app/utils/response/customError'

import {
format
} from '././app/utils/response/response'

// 跨域支持

/**
 * 
 * 跨域
 */
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        //      return 'http://localhost:8080'; / 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))



onerror(app)
app.use(bodyParser());
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/views'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))


app.use((ctx, next) => {
    return next().catch((err) => {
      let code = 500
      let msg = '异常错误'
  
      if (err instanceof CustomError || err instanceof HttpError) {
        const res = err.getCodeMsg()
        ctx.status = err instanceof HttpError ? res.code : 200
        code = res.code
        msg = res.msg
      } else {
        ctx.status = code
        console.error('err', err)
      }
      ctx.body = format({}, code, msg)
    })
})
// check request param
// require('koa-validate')(app)

app.use(async (ctx, next) => {
  await next()
  console.log(ctx.body._readableState);
  if(ctx.body._readableState){
    ctx.body = ctx.body;
  }else{
    ctx.body = format(ctx.body);
  }

})

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(api.routes(), api.allowedMethods())
app.use(ethapi.routes(), ethapi.allowedMethods())
// app.get("/", function * (next){
//   serve(__dirname + "/views/index.html");
// });

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
