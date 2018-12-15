import {sequelize} from '../db';
import config from '../config';

import ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';

import Web3 from 'web3';
import axios from 'axios';

const crypto = require('crypto');
// import config from './utils/config';
const api_users = sequelize.models.api_users;
const user_dapp_info = sequelize.models.user_dapp_info;
const user_contact = sequelize.models.user_contact;



class ApiController {
    
    // 进行授权 api/auth post
    // router.post('/auth', 
    async postOuth(ctx, next) {
        // console.log(ctx.request.body);
        const { signature, publicAddress } = ctx.request.body;
        if (!signature || !publicAddress)
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR, '此账户没有权限')
        let accessToken = await api_users.findOne({ where: { publicAddress } }).then(api_users => {
            if (!api_users)
                ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR, `User with publicAddress ${publicAddress} is not found in database`)
            return api_users;
        })
        .then(api_users => {
            const msg = `I am signing: ${api_users.nonce}`;
            const msgBuffer = ethUtil.toBuffer(msg);
            const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
            const signatureBuffer = ethUtil.toBuffer(signature);
            const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
            const publicKey = ethUtil.ecrecover(
                msgHash,
                signatureParams.v,
                signatureParams.r,
                signatureParams.s
            );
            const addressBuffer = ethUtil.publicToAddress(publicKey);
            const address = ethUtil.bufferToHex(addressBuffer);
            if (address.toLowerCase() === publicAddress.toLowerCase()) {
                return api_users;
            } else {
                throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED,
                    `Signature verification failed`);
            }
        })
        .then(api_users => {
            api_users.nonce = Math.floor(Math.random() * 10000);
            return api_users.save();
        }).then(
            api_users =>
                new Promise((resolve, reject) =>
                    //jwt.sign将一些信息记录到jwt中
                    jwt.sign(
                        {
                            payload: {
                                id: api_users.id,
                                publicAddress
                            }
                        },
                        config.secret, //私钥是非常关键,有了它jwt才能解析
                        null,
                        (err, token) => {
                            if (err) {
                                console.log('err \n ', err);
                                return reject(err);
                            }
                            console.log('token \n ', token);
                            return resolve(token);
                        }
                    )
                )
        );
        ctx.body = { accessToken };
    }

    /**
     * @api {post} /api/users 提交用户信息
     */
    async insertapiuser(ctx, next) {
        console.log('request.body:', ctx.request.body);
        let resultData = await api_users.create(ctx.request.body); 
        ctx.send(resultData);
    }

    async getapiuser(ctx, next) {
        console.log("router.get('/users', async (ctx, next) => {");
        ctx.body = await api_users.findAll({ where: { publicAddress: ctx.query.publicAddress } });
        // const whereClause = ctx.query &&ctx.query.publicAddress && {
        //     where: { publicAddress: ctx.query.publicAddress }
        // };
        // let rows = await mysql.select('api_users', whereClause);
        // ctx.body = rows;
       
    }

    /**
     *   @api {get} /api/users 获取用户信息
     */
    async apiuserinfo(ctx, next) {
        if (ctx.state.user.payload.id !== +ctx.params.userId) {
            console.log(ctx.params.userId);
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR,
                `You can can only access yourself`);
        }
        let resultData = await api_users.findById(ctx.params.userId);
        console.log('resultData:',resultData);
        ctx.send(resultData);
    }

    /**
     *   @api {post} /api/users 设置用户信息
     */
    async patchapiuser(ctx, next) {

        if (ctx.state.user.payload.id !== + ctx.params.userId) {
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR,
                `You can can only access yourself`);
        }
        ctx.body = await api_users.findById(ctx.params.userId)
        .then(api_users => {
            Object.assign(api_users, ctx.request.body);
            return api_users.save();
        });
    }


    /**
     *  @api {get} /api/users/contact 获取联系人信息
     *  
     *  /api/user/contact/0x81d723361d4f3e648f2c9c479d88dc6debf4fa5f
     */
    async getApiUsercontact(ctx, next) {
        console.log('\n ctx.params.address:', ctx.params.address);
        ctx.body = await user_contact.findAll({ where: { address: ctx.params.address } });
        // ctx.body = await api_users.findById(ctx.params.userId);
    }

    /**
     *   @api {post} /api/users/contact 提交联系人
     */
    async postApiUsercontact(ctx, next) {
        console.log('222'); 
        console.log('\n \n \n :',ctx.request.body);
        ctx.body = await user_contact.create(ctx.request.body); 
    }

    /**
     *   @api {get} /api/usercontact/:address 获取联系人 
     */
    // async getUsercontact(ctx, next){
    //     console.log('\n ctx.params.address:', ctx.params.address);
    //     ctx.body = await user_contact.findAll({ where: { address: ctx.params.address} });
    //     // ctx.body = await api_users.findById(ctx.params.userId);
    // }

    /**
     * 
     * @api {get} /api/dapp/contract/:publicaddress 获取指定地址的dapp列表
     * @apiName 获取指定地址的dapp列表
     * 
     * 
     * @apiSuccess (200) {type} name  获取指定地址的dapp列表
     * 
     * 
     * @apiParamExample  {type} Request-Example:
     *  api/dapp/0x210efed6635905c7c7c98b20d24747c723dd4ebe
     * 
     * [
     *      {
     *           "id": 3,
     *           "publicAddress": "0x210efed6635905c7c7c98b20d24747c723dd4ebe",
     *          "dappName": "111",
     *           "contractAddress": "0x090652a4aecee28a7ae766c5bd51851830185664",
     *          "contractInfo": null,
     *           "dappChain": null,
     *           "createdAt": "2018-09-14T06:33:05.000Z",
     *           "updatedAt": "2018-09-14T06:33:05.000Z"
     *       }
     * ]
     * @apiSuccessExample {type} Success-Response:
     * {
     *     property : value
     * }
     * 
     */
    async dappcontract(ctx, next) {
        let resultData = await user_dapp_info.findAll({ raw: true, where: { publicAddress: ctx.params.publicaddress} });
        let returnData = [];
        // console.log('eth_ropsten:',config.rpcurl[ctx.query.chain]);
        let web3 = new Web3(new Web3.providers.HttpProvider(config.rpcurl[ctx.query.chain]));
        // console.log(resultData);
        for(let item of resultData) {     
            if(item['contractAddress'] == null && item['dappChain']== ctx.query.chain){
                
                console.log(item);
                let transactionInfo = await web3.eth.getTransactionReceipt(item['txHash']);
                item['contractAddress'] = transactionInfo['contractAddress'];
                // console.log(transactionInfo['contractAddress']);
                returnData.push(item); 
            }     
        } 

        ctx.send(returnData)
    }

    /**
     *   @api {post} /api/dapp 提交新dapp
     */
    async postDapp(ctx, next) {
        // console.log('3232323232::: =》》》', ctx.request.body);
     
        ctx.body = await user_dapp_info.create(ctx.request.body);   
    }
    
    async getCoffeeTicket(ctx, next) {
        const telephone = ctx.query.telephone;
        //活动码
        const inviteCode = 'MK20181214003';
        //时间戳
        //const timestamp = '4343434343';
        //签名
        // const signature = '434343434';

        let param = {}; 
        param['mobile'] = ctx.query.telephone.toString(); //telephone; 
        param['inviteCode'] = 'MK20181214003';
        param['timestamp'] = Date.parse( new Date()).toString();//数量
    
        const hash = crypto.createHash('sha1');
        // 可任意多次调用update():
        hash.update(param['inviteCode']);
        hash.update(param['mobile']);
        hash.update(param['timestamp']);
        param['signature'] = hash.digest('hex'); 
        console.log('param', param);
        // console.log('hash.digest:', hash.digest('hex')); // 7e1977739c748beac0c0fd14fd26a544
        //https://mkt.luckincoffee.com/extapi/coupon
        let response = await axios.get('https://mkt.luckincoffee.com/extapi/coupon', {
            params: param
        });    
        console.log(response.data);
        
        ctx.body = response.data
        // ctx.apidata({response}); 
    }
}

export default new ApiController();

