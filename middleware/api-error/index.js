const codeMsg = require("./codeMsg")
const customCode = require("./customCode")
module.exports = () => {
    function toerror(code) {
        console.log(codeMsg[code]);
        this.set("Content-Type", "application/json")
        this.body = JSON.stringify({
            code: code,
            msg: codeMsg[code]
        })
    }

    return async (ctx, next) => {
        let error_code = '';
        //载入错误码列表
        ctx.customCode = customCode;
        try {
            //controller中调取ctx.apierror触发异常抛出
            // 参数 code为codeMsg中的key，message参数为抛出异常内容，如不此参，则返回codeMsg[code]
            ctx.apierror = (code, message) => {
              //读取异常
              error_code  = code; 
             // message参数为抛出异常内容，如不此参，则返回codeMsg[code]
              ctx.throw(code || 500, message || codeMsg[code] || '未知原因');
            };
            await next();
          } catch (e) {
            let code = error_code;
            let message = e.message || '未知原因';
            if(e.message == 'Authentication Error') {
                code = 1005;
            }
            ctx.send({ code, message });
        }
    }
}
