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
        console.log('api-error start');
        let error_code,code,message = '';
        //载入错误码列表
        ctx.customCode = customCode;
    
        //路由包含api的走api标准输出
        try {
            //controller中调取ctx.apierror触发异常抛出
            // 参数 code为codeMsg中的key，message参数为抛出异常内容，如不此参，则返回codeMsg[code]
            ctx.apierror = (code, message) => {
                //读取异常
                error_code = code;
                // message参数为抛出异常内容，如不此参，则返回codeMsg[code]
                ctx.throw(code || 500, message || codeMsg[code] || '未知原因');
            };
            await next();
        } catch (e) {
            code = error_code;
            message = e.message || '未知原因';
            if (e.message == 'Authentication Error') {
                code = 1005;
            }
            
            if (!error_code) {
                code = ctx.customCode.OTHER_ERROR; //未知错误原因,统一为1111 
            }  
            
            //判断路由,是API, 则输出
            if (ctx.path.includes('/api/')) {
                ctx.send({ code, message });
            } else {
                //判断路由,非API,ctx.body直接输出.
                console.log(':', { code, message });
            }
        }

    }
}
