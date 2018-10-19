import sequelize from '../db';
import config from '../config';

import ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
// import config from './utils/config';
const api_users = sequelize.models.api_users;
const user_dapp_info = sequelize.models.user_dapp_info;
const user_contact = sequelize.models.user_contact;

class ApiController {
    /**
     * 
     * @api {get} /api/
     * @apiName API
     * @apiGroup group
     * @apiVersion  major.minor.patch
     * 
     * 
     * @apiParam  {String} paramName description
     * 
     * @apiSuccess (200) {type} name description
     * 
     * @apiParamExample  {type} Request-Example:
     * {
     *     property : value
     * }
     * 
     * 
     * 
     */
  
    //  进行授权 api/auth post
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
     *   @api {get} /api/users/contact 获取联系人信息
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
        if (ctx.state.user.payload.publicAddress !== ctx.params.publicaddress) {

            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR,
            `You can can only access yourself`);    
        }
        let resultData = await user_dapp_info.findAll({ where: { publicAddress: ctx.params.publicaddress} });
        // console.log(resultData);
        ctx.send(resultData)
    }

    /**
     *   @api {post} /api/dapp 提交新dapp
     */
    async postDapp(ctx, next) {
        console.log('3232323232:::', ctx.request.body);
        // if (ctx.state.user.payload.publicAddress !== +ctx.params.publicaddress) {
        //     throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED, 
        //         `You can can only access yourself`);
        // }
        ctx.body = await user_dapp_info.create(ctx.request.body);   
    }
    
}

export default new ApiController();

