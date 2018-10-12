// const logger = require("./logger")
// import logger from './logger'
// module.exports = () => {
//    return logger()
// }

const logger = require("./logger")
module.exports = (options) => {
  const loggerMiddleware = logger(options)

  return (ctx, next) => {
    return loggerMiddleware(ctx, next)
    .catch((e) => {
        if (ctx.status < 500) {
            ctx.status = 500;
        }
        ctx.log.error(e.stack);
        ctx.state.logged = true;
        ctx.throw(e);
    })
  }
}


//8 257 00000 00000 00000