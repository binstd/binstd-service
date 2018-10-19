// const router = require('koa-router')()
import Router from 'koa-router';
import HomeController from './controller/home'
import ApiController from './controller/api'
import ChainApiController from './controller/chainapi';
import config from './config';
const router = Router();
import koajwt from 'koa-jwt';

module.exports = (app) => {
    router.get( '/', HomeController.index )
    router.get('/home', HomeController.home)
    router.get('/home/:id/:name', HomeController.homeParams)
    router.get('/user', HomeController.login)
    router.post('/user/register', HomeController.register)

    // router.get('/api/:id', ApiController.hello)
    
    //提交auth申请
    router.post('/api/auth', ApiController.postOuth)
    
    //查询用户信息(公用)
    router.get('/api/users', ApiController.getapiuser)

    //提交用户信息
    router.post('/api/users', ApiController.insertapiuser)

    //获取用户信息
    router.get('/api/users/:userId', koajwt({ secret: config.secret }), ApiController.apiuserinfo)
    
    //修改用户信息
    router.patch('/api/users/:userId', koajwt({ secret: config.secret }), ApiController.patchapiuser)
    
    // ‘/api/usercontact’ 提交联系人 
    router.post('/api/user/contact', ApiController.postApiUsercontact)

    // ‘/api/usercontact/:address' 获取联系人
    router.get('/api/user/contact/:address',ApiController.getApiUsercontact)

    //获取用户联系人
    //router.get('/usercontact/:address', ApiController.getUsercontact)    
    
    //根据address获取dapp列表
    router.get('/api/dapp/:publicaddress', koajwt({ secret: config.secret }), ApiController.dappcontract)
    
    //提交新dapp
    router.post('/api/dapp', koajwt({ secret: config.secret }), ApiController.postDapp)

    //获取余额
    router.get('/api/chain/balance', /*koajwt({ secret: config.secret }), */ ChainApiController.getbalance)
    
    //获取token详情
    router.get('/api/chain/tokeninfo', /*koajwt({ secret: config.secret }), */ ChainApiController.gettokeninfo)
    
    //获取token详情
    router.get('/api/chain/gasprice', /*koajwt({ secret: config.secret }), */ ChainApiController.getGasprice)
   
    //获取交易记录列表
    router.get('/api/chain/tokentx', /*koajwt({ secret: config.secret }), */ ChainApiController.getTokentxList)

    //获取交易信息
    router.get('/api/chain/tokentx/:hash', /*koajwt({ secret: config.secret }), */ ChainApiController.getTokentx)

    //post批量转账
    router.post('/api/chain/moretransfer', /*koajwt({ secret: config.secret }), */ ChainApiController.postMoreTransfer)

    //get批量转账
    router.get('/api/chain/moretransfer', /*koajwt({ secret: config.secret }), */ ChainApiController.getMoreTransfer)
    app.use(router.routes())
        .use(router.allowedMethods())
}