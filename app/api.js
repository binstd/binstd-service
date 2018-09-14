const router = require('koa-router')();
var mysql = require('./utils/mysql');
var crypto = require('crypto');
var moment = require('moment');
var axios = require('axios');
router.prefix('/api')
import ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import koajwt from 'koa-jwt';

import sequelize from './db';
import config from './utils/config';
const api_users = sequelize.models.api_users;
const user_dapp_info = sequelize.models.user_dapp_info;
import {
    CustomError,
    HttpError
} from './utils/response/customError'
import constants from './utils/response/constants'

router.get('/contact', async (req, next) => {
    var keyinfo = [];
    let resultData = {};
    let uid = req.query.uid;
    if (req.query.uid) {
        keyinfo = await mysql.select('user_contact', {
            where: {
                uid: uid
            }
        });
    }

    if (keyinfo.length != 0) {
        resultData = { 'status': 1, 'data': keyinfo };
    } else {
        resultData = { 'status': 0 };
    }

    console.log(resultData);
    req.body = resultData
})

// 获取token列表
router.get('/tokens', async (req, next) => {
    var keyinfo, resultData = {};
    let uid = req.query.uid;
    keyinfo = await mysql.select('user_token', {
        where: {
            uid: 1,
            showed: 1
        }
    });
    if (keyinfo.length != 0) {
        resultData = { 'status': 1, 'data': keyinfo };
    } else {
        resultData = { 'status': 0 };
    }
    req.body = resultData
})


//注册
router.get('/signup', async (req, next) => {
    let result = {
        status: 0,
        message: '未输入'
    }
    let keyinfo = {}
    let telephone = req.query.telephone;
    let password = req.query.password;
    let privatekey = req.query.privatekey;
    let address = req.query.address;
    let row = {
        telephone: telephone,
        password: password,
        privatekey: privatekey,
        address: address
    };

    if (req.query.telephone && req.query.password) {
        keyinfo = await mysql.query('SELECT uid,telephone,address,privatekey,username,img_url FROM user WHERE telephone=?', [telephone]);
        console.log(keyinfo);
        if (keyinfo.length == 1) {
            result['status'] = 3;
            result['message'] = '手机号已存在,请登陆';
        } else {
            result = await mysql.insert('user', row);
            if (result['affectedRows'] == 1) {
                result['status'] = 1;
                result['message'] = '注册成功';
            } else {
                result['status'] = 0;
                result['message'] = '注册失败';
            }
        }
    }
    console.log('登陆后返回:', result);
    req.body = result;
})



//登陆
router.post('/signin', async (req, next) => {
    var keyinfo, resultData = {};

    console.log(req.request.body);

    if (req.request.body.telephone && req.request.body.password) {
        let telephone = req.request.body.telephone;
        let password = req.request.body.password;
        keyinfo = await mysql.query('SELECT uid,telephone,address,privatekey,username,img_url,pay_password FROM user WHERE telephone=? AND password=?', [telephone, password]);
    }

    console.log(keyinfo);

    if (keyinfo.length == 1) {
        resultData = { 'status': 1, 'data': keyinfo[0] };
    } else {
        resultData = { 'status': 0, 'message': '账号或密码错误' };
    }
    console.log(resultData);
    req.body = await resultData
})

//添加联系人
router.post('/addcontact', async (req, next) => {
    let result = {
        status: 0,
        message: '未输入'
    }

    let keyinfo = {}
    let contact_address = req.query.contact_address;
    let uid = req.query.uid;
    let contact_name = req.query.contact_name;
    let row = {
        uid: uid,
        contact_address: contact_address,
        contact_name: contact_name
    };
    if (req.query.contact_address && req.query.uid) {
        keyinfo = await mysql.query('SELECT uid,contact_name,contact_uid,contact_address FROM user_contact WHERE contact_address=? AND uid=?', [contact_address, uid]);
        if (keyinfo.length == 1) {
            result['status'] = 3;
            result['message'] = '该联系人已存在';
        } else {
            result = await mysql.insert('user_contact', row);
            if (result['affectedRows'] == 1) {
                result['status'] = 1;
                result['message'] = '添加成功';
            } else {
                result['status'] = 0;
                result['message'] = '添加失败';
            }
        }
    }
    req.body = result;
})


/* 更改用户名 */
router.post('/updatename', async (req, next) => {
    var keyinfo = {}
    let uid = req.query.uid;
    let username = req.query.username;
    let row = {
        username: username
    };
 
    if (req.query.username && req.query.uid) {

        keyinfo = await mysql.update('user', row, { where: { uid: uid } });
    }
    console.log(keyinfo);
    req.body = keyinfo;
});


router.post('/updatephone', async (req, res) => {
    var keyinfo = {}
    let uid = req.query.uid;
    let telephone = req.query.phone;
    let row = {
        telephone: telephone
    };
    console.log('是我呀');
    console.log('row:', row);
    if (req.query.phone && req.query.uid) {
        keyinfo = await mysql.update('user', row, { where: { uid: uid } });
    }
    console.log(keyinfo);
    req.body = keyinfo;

});

router.post('/updatepaypassword', async (req, res) => {
    var keyinfo = {}
    let uid = req.query.uid;
    let paypassword = req.query.password;
    let row = {
        pay_password: paypassword
    };
    console.log('row:', row);
    if (req.query.password && req.query.uid) {
        keyinfo = await mysql.update('user', row, { where: { uid: uid } });
    }
    console.log(keyinfo);
    req.body = keyinfo;
});

router.get('/user', async (req, res) => {
    let rows = await mysql.select('tags', { columns: ['id', 'name', 'feature_image', 'slug', 'all_child'] });
    console.log(rows);
    req.body = rows;
    // res.send(rows);
});




// 短信接口对接
router.get('/verify', async (req, res) => {
    let rows = {};
    let paramMsg = {};
    rows['code'] = Math.random().toString().slice(-4);
    console.log(rows);
    var today = moment();
    var time = today.format('YYYYMMDDHHmmss'); /*现在的年*/
    // YYYY-MM-DD HH:mm:ss
    //   console.log('time:', time);
    let password = 'jhD72SVM';
    let md5password = crypto.createHash('md5').update(password).digest('hex');
    let msgpass = crypto.createHash('md5').update(md5password + time).digest('hex');
    console.log('msgpass:', msgpass);
    paramMsg['username'] = "proginn1";
    paramMsg['tkey'] = time;
    paramMsg['password'] = msgpass;
    paramMsg['mobile'] = req.query.telephone;
    paramMsg['content'] = rows['code'];
    paramMsg['productid'] = '170831';
    console.log(paramMsg);
    let response = await axios.get("http://www.ztsms.cn/sendNSms.do", {
        params: paramMsg
    });

    req.body = rows;
});

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
})



/**
 * 
 * 新世界 
 */

// 根据钱包地址获取用户
router.get('/users', async (ctx, next) => {
    const whereClause = ctx.query &&ctx.query.publicAddress && {
            where: { publicAddress: ctx.query.publicAddress }
    };
    let rows = await mysql.select('api_users', whereClause);
    ctx.body = rows;
    console.log("router.get('/users', async (ctx, next) => {");
})


// 获取用户信息
router.get('/users/:userId', koajwt({ secret: config.secret }), async (ctx, next) => {
    
    if (ctx.state.user.payload.id !== +ctx.params.userId) {
        throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED, 
            `You can can only access yourself`);
    }
    ctx.body = await api_users.findById(ctx.params.userId);
})

// 提交用户修改资料
router.patch('/users/:userId', koajwt({ secret: config.secret }), async (ctx, next) => {
    // console.log('request....body:', ctx.request.body);
    // console.log(ctx.state.user.payload.id);
    if (ctx.state.user.payload.id !== +ctx.params.userId) {
        throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED,
            `You can can only access yourself`);
    }
    ctx.body = await api_users.findById(ctx.params.userId)
        .then(api_users => {
            Object.assign(api_users, ctx.request.body);
            return api_users.save();
        });
})


//  提交增加
router.post('/users', async(ctx, next) => {
    console.log('request.body:', ctx.request.body);
    ctx.body = await api_users.create(ctx.request.body);   
})

//  进行授权 api/auth post
router.post('/auth', async (ctx, next) => {
    // console.log(ctx.request.body);
    const { signature, publicAddress } = ctx.request.body;
    if (!signature || !publicAddress)
        throw new HttpError(constants.HTTP_CODE.BAD_REQUEST, '此账户没有权限')
    let accessToken = await api_users.findOne({ where: { publicAddress } }).then(api_users => {
        if (!api_users)
            throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED,
                `User with publicAddress ${publicAddress} is not found in database`);
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
                    jwt.sign(
                        {
                            payload: {
                                id: api_users.id,
                                publicAddress
                            }
                        },
                        config.secret,
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
})


// 获取指定钱包地址用户的合约信息
router.get('/dapp/:publicaddress', koajwt({ secret: config.secret }), async (ctx, next) => {
    console.log('=========!');    
    console.log(ctx.state.user.payload.publicAddress);
    if (ctx.state.user.payload.publicAddress !== ctx.params.publicaddress) {
        throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED, 
            `You can can only access yourself`);
    }
    ctx.body = await user_dapp_info.findAll({ where: { publicAddress: ctx.params.publicaddress} });
    // user_dapp_info.findById(ctx.params.userId);
})


//  提交增加
router.post('/dapp', koajwt({ secret: config.secret }), async(ctx, next) => {
    console.log('3232323232:::', ctx.request.body);
    // if (ctx.state.user.payload.publicAddress !== +ctx.params.publicaddress) {
    //     throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED, 
    //         `You can can only access yourself`);
    // }
    ctx.body = await user_dapp_info.create(ctx.request.body);   
})


module.exports = router





// findAll({ where: { name: 'A Project' } })