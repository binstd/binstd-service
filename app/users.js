const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
  console.log(ctx.request.body);
  console.log(ctx.query);
  ctx.body = ctx.query.m
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
