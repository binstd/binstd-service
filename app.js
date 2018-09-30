const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = require('./router');

app.use(bodyParser());

router(app);
 
// 增加代码
// app.use(async (ctx, next) => {
//     await next()
//     ctx.response.type = 'text/html'
//     ctx.response.body = '<h1>Hello World</h1>'
// })

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})