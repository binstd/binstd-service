// 丰富日志信息
// 在 ctx 对象中，有一些客户端信息是我们数据统计及排查问题所需要的，所以完全可以利用这些信息来丰富日志内容。在这里，我们只需要修改挂载 ctx 对象的 log 函数的传入参数：
// logger[method](message)
// 参数 message 是一个字符串，所以我们封装一个函数，用来把信息与上下文 ctx 中的客户端信息相结合，并返回字符串。
// 增加日志信息的封装文件 mi-log/access.js：
module.exports = (ctx, message, commonInfo) => {
    const {
      method,  // 请求方法 get post或其他
      url,		  // 请求链接
      host,	  // 发送请求的客户端的host
      headers	  // 请求中的headers
    } = ctx.request;
    
    const client = {
      method,
      url,
      host,
      message,
      referer: headers['referer'],  // 请求的源地址
      userAgent: headers['user-agent']  // 客户端信息 设备及浏览器信息
    }
    return JSON.stringify(Object.assign(commonInfo, client));
  }