module.exports = () => {
    function render(json) {
        this.set("Content-Type", "application/json")
        this.body = JSON.stringify(json)
    }

    function apidata(json) {
        let resultData = {code:0, msg:'ok',data:json}
        this.set("Content-Type", "application/json")
        this.body = JSON.stringify(resultData)
    }

    return async (ctx, next) => {
        ctx.send = render.bind(ctx)
        ctx.apidata = apidata.bind(ctx)
        // 调用ctx上的log方法下的error方法打印日志
        await next()
    }
}