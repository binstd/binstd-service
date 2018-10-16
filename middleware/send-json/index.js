module.exports = () => {
    function render(json) {
       // console.log('render..');
        this.set("Content-Type", "application/json")
        this.body = JSON.stringify(json)
    }

    function apidata(json) {
        //console.log('apidata',json);
        let resultData = {code:0, msg:'ok',data:json}
        //console.log({resultData});
        this.set("Content-Type", "application/json")
        this.body = JSON.stringify(resultData)
    }

    return async (ctx, next) => {
        ctx.send = render.bind(ctx)
        //console.log('console.log(this.body):',ctx.body);
        ctx.apidata = apidata.bind(ctx)
        await next();
      
    }
}