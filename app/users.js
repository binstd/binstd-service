const router = require('koa-router')()

router.prefix('/api')

router.get('/', function (ctx, next) {
  console.log(ctx.request.body);
  console.log(ctx.query);
  ctx.body = 'this is !'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
