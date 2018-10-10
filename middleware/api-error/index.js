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

    // function customCode(){
    //     console.log();
    //     return customCode
    // }

    return async (ctx, next) => {
        let error_code = '';
        ctx.customCode = customCode;
        try {
            ctx.apierror = (code, message) => {
              error_code  = code; 
              ctx.throw(code || 500, message || codeMsg[code] || '未知原因');
            };
            await next();
          } catch (e) {
            let code = error_code;
            let message = e.message || '未知原因';
            ctx.send({ code, message });
        }
    }
}
