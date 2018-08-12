const router = require('koa-router')();

router.prefix('/index')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/HttpError', (ctx, next) => {
    throw new HttpError(HTTP_CODE.FORBIDDEN)
  })
  
  const somefunc = async (token) => {
    const res = await tokenExpire(token)
    if (res) {
      throw new CustomError(CUSTOM_CODE.SOME_CUSTOM_ERROR)
    }
    // do something
  }

module.exports = router
