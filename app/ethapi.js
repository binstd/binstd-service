const router = require('koa-router')();
var {erc20} = require('./utils/abi/ethAbi');
var Web3 = require('web3');
// var isconnecteth = require('./utils/bc');
import validator from 'validator';

import {blockchainconfig} from './utils/bcconfig';
import {isconnecteth, getweb3} from './utils/bc';
import {
    CustomError,
    HttpError
  } from './utils/response/customError'
import constants from './utils/response/constants'

const rpc_url = 'https://mainnet.infura.io/v3/0045c2ce288a4e649a8f39f3d19446b4';
// var blockchainconfig = require('./utils/bcconfig');


router.prefix('/ethapi');

router.get('/', async (ctx, next) => {
//   await ctx.render('index', {
//     title: 'api eth'
//   })
})


/**
 * 
 * @api {get} /ethapi/balance title
 * @apiName 余额查询接口
 * @apiGroup group
 * @apiVersion  0.1
 * 
 * @apiParam  {String} paramName description
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 */ 
router.get('/balance', async(ctx, next) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
    let my = "0xD551234Ae421e3BCBA99A0Da6d736074f22192FF"
    let eos_contract_address = "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0"
    // 钱包地址校正
    if(!web3.utils.isAddress(ctx.query.address)){
        throw new CustomError(constants.CUSTOM_CODE.WALLET_ADDRESS_ERROR)
    }
    // 合约地址
    if(!web3.utils.isAddress(ctx.query.contract_address)){
        throw new CustomError(constants.CUSTOM_CODE.CONTRACT_ADDRESS_ERROR)
    }
    
    // web3.utils.isAddress
    let result  = {} ;
  
    let contract = new web3.eth.Contract(erc20, ctx.query.contract_address);
    let balanceof  = await contract.methods.balanceOf(ctx.query.address).call();
    // let decimals = await contract.methods.decimals().call();
    // let name = await contract.methods.name().call();
    // let symbol = await contract.methods.symbol().call();
    console.log(balanceof);
    // console.log(decimals);
    // throw new CustomError(constants.CUSTOM_CODE.WALLET_ADDRESS_ERROR)
    ctx.body = {
        // name:web3.utils.hexToUtf8(name),
        // symbol:web3.utils.hexToUtf8(symbol),
        // amount:balanceof/Math.pow(10,decimals),
        balance: balanceof,
        // decimals: decimals
    }
    // ctx.body  = result;
})


router.get('/tokeninfo', async(ctx, next) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
    let my = "0xD551234Ae421e3BCBA99A0Da6d736074f22192FF"
    let eos_contract_address = "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0"
    // 钱包地址校正
    if(!web3.utils.isAddress(ctx.query.address)){
        throw new CustomError(constants.CUSTOM_CODE.WALLET_ADDRESS_ERROR)
    }
    // 合约地址
    if(!web3.utils.isAddress(ctx.query.contract_address)){
        throw new CustomError(constants.CUSTOM_CODE.CONTRACT_ADDRESS_ERROR)
    }
    
    // web3.utils.isAddress
    let result  = {} ;
    let contract = new web3.eth.Contract(erc20, ctx.query.contract_address);
    let decimals = await contract.methods.decimals().call();
    let name = await contract.methods.name().call();
    let symbol = await contract.methods.symbol().call();
   
    // throw new CustomError(constants.CUSTOM_CODE.WALLET_ADDRESS_ERROR)
    ctx.body = {
        name:web3.utils.hexToUtf8(name),
        symbol:web3.utils.hexToUtf8(symbol),
        decimals: decimals
    }
    // ctx.body  = result;
})

router.get('/gasprice', async(ctx, next) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
    let gasprice = await web3.eth.getGasPrice();
    ctx.body = {
        wei:gasprice, 
    }
    // ctx.body  = result;
})

module.exports = router