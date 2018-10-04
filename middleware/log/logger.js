// const log4js = require('log4js');
import log4js from 'log4js'

const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]

module.exports = ( options ) => {
  const contextLogger = {}  
  
  //按日期打印日志
  const config = {
    appenders: {
        cheese: {
         type: 'dateFile', // 日志类型 
         filename: `logs/task`,  // 输出的文件名
         pattern: '-yyyy-MM-dd.log',  // 文件名增加后缀
         alwaysIncludePattern: true   // 是否总是有后缀名
       }
    },
    categories: {
      default: {
        appenders: ['cheese'],
        level:'info'
      }
    }
  } 

  const logger = log4js.getLogger('cheese');
  return async (ctx, next) => {
    const start = Date.now()
    log4js.configure(config)
   
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