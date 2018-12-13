// const router = require('koa-router')()
import Router from 'koa-router';
import HomeController from './controller/home'
import ApiController from './controller/api'
import ChainApiController from './controller/chainapi';

//爬虫&内容API
import SpiderApiController from './controller/spiderapi';

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
    // router.get('/api/dapp/:publicaddress', koajwt({ secret: config.secret }), ApiController.dappcontract)
    router.get('/api/dapp/:publicaddress',  ApiController.dappcontract)
    //提交新dapp
    router.post('/api/dapp', ApiController.postDapp)

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
   
    //获取abi
    router.get('/api/chain/abi', /*koajwt({ secret: config.secret }), */ ChainApiController.getAbi)
   
    //获取合约列表
    router.get('/api/chain/allcontractlist', /*koajwt({ secret: config.secret }), */ ChainApiController.getAllContractList)

    router.get('/api/article', /*koajwt({ secret: config.secret }), */ SpiderApiController.getArticle)
   
    router.get('/api/spiders', /*koajwt({ secret: config.secret }), */ SpiderApiController.getSpiders)
    router.get('/api/spiders/:id', /*koajwt({ secret: config.secret }), */ SpiderApiController.getOneSpiders)
    router.put('/api/spiders/:id', SpiderApiController.patchSpiders)
    
    
    router.get('/api/spiderstags', /*koajwt({ secret: config.secret }), */ SpiderApiController.getSpidersTags)
    router.get('/api/spiderstags/:id', /*koajwt({ secret: config.secret }), */ SpiderApiController.getOneSpidersTags)
    router.put('/api/spiderstags/:id', SpiderApiController.patchSpidersTags)


    app.use(router.routes())
        .use(router.allowedMethods())
}