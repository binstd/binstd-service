// const log4js = require('log4js');
import log4js from 'log4js'

const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]

module.exports = ( options ) => {
  const contextLogger = {}  

  return async (ctx, next) => {
    const start = Date.now()
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'info' } }
    }); 
    const logger = log4js.getLogger('cheese');


      // 循环methods将所有方法挂载到ctx 上
      methods.forEach((method, i) => {
        contextLogger[method] = (message) => {
          logger[method](message)
        }
     })
    ctx.log = contextLogger;
    await next()
    const end = Date.now()
    const responseTime = end - start;
    logger.info(`响应时间为${responseTime/1000}s`);
  }
}