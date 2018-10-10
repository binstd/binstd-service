class ApiController {
    async hello(ctx, next) {
        console.log(ctx.params)
        console.log('customCode:',ctx.customCode.CONTRACT_ADDRESS_ERROR);
        //示范
        ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR)
        ctx.send({
          status: 'success',
          data: 'api成功！'
        })
    }
}

export default new ApiController();