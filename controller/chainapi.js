import sequelize from '../db';
import config from '../config';

import ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import Web3 from 'web3';
// import config from './utils/config';
const api_users = sequelize.models.api_users;
const user_dapp_info = sequelize.models.user_dapp_info;
const user_contact = sequelize.models.user_contact;

class ChainApiController {

    async balance(ctx, next) {
        console.log('request=body:', ctx.request.body);
        let jsondata = await api_users.create(ctx.request.body);
        console.log(ctx.params)
        console.log('customCode:', ctx.customCode.CONTRACT_ADDRESS_ERROR);
        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
        ctx.send(jsondata)
    }

    async tokeninfo(ctx, next) {
        // tokenjson
        // console.log(tokenjson.abi);
        let web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
        let my = "0xD551234Ae421e3BCBA99A0Da6d736074f22192FF"
        let eos_contract_address = "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0"

        // 合约地址
        if (!web3.utils.isAddress(ctx.query.contract_address)) {
            ctx.apierror(constants.CUSTOM_CODE.CONTRACT_ADDRESS_ERROR)
        }
        console.log(':', ctx.query.contract_address);
        let contract = new web3.eth.Contract(tokenjson.abi, ctx.query.contract_address);
        let decimals = await contract.methods.decimals().call();
        let name = await contract.methods.name().call();
        let symbol = await contract.methods.symbol().call();
        console.log('name:', name);
        console.log('symbol:', symbol);
        console.log('decimals:', decimals);
        // throw new CustomError(constants.CUSTOM_CODE.WALLET_ADDRESS_ERROR)
        ctx.body = {
            name: name,
            symbol: symbol,
            decimals: decimals
        }
    }

    /**
     * @api  获取币余额
     */
    async getbalance(ctx, next) {
        //    ctx.body = config.rpcurl[ctx.query.chain];
        let web3 = new Web3(new Web3.providers.HttpProvider(config.rpcurl[ctx.query.chain]));
        //dome_address = "0xD551234Ae421e3BCBA99A0Da6d736074f22192FF"
        ///eos_contract_address = "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0"
        // 钱包地址校正
        if (!web3.utils.isAddress(ctx.query.address)) {
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR, '此账户2没有权限')
        }
        // 合约地址
        if (!web3.utils.isAddress(ctx.query.contract_address)) {
            console.log('ctx.query.contract_address');
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR, '此账23户没有权限')
        }
        // web3.utils.isAddress
        let result = {};

        let contract = new web3.eth.Contract(config.erc20abi, ctx.query.contract_address);
        let balanceof = await contract.methods.balanceOf(ctx.query.address).call();

        console.log(balanceof);

        // ctx.body = 
        ctx.apidata({ balance: balanceof });
        next();
    }

    /**
     * @api 获取token详情
     */
    async gettokeninfo(ctx, next) {
        let web3 = new Web3(new Web3.providers.HttpProvider(config.rpcurl[ctx.query.chain]));
        //let my = "0xD551234Ae421e3BCBA99A0Da6d736074f22192FF"
        // let eos_contract_address = "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0"
        // 合约地址
        if (!web3.utils.isAddress(ctx.query.contract_address)) {
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR)
        }
        let contract = new web3.eth.Contract(config.erc20abi, ctx.query.contract_address);
        let decimals = await contract.methods.decimals().call();
        let name = await contract.methods.name().call();
        let symbol = await contract.methods.symbol().call();

        ctx.apidata({
            name: name,
            symbol: symbol,
            decimals: decimals
        });
    }

    /**
     * @api 获取token价格
     */
    async getGasprice(ctx, next) {
        let web3 = new Web3(new Web3.providers.HttpProvider(config.rpcurl[ctx.query.chain]));
        let gasprice = await web3.eth.getGasPrice();
        console.log('gasprice:', gasprice);
        ctx.apidata({
            wei: gasprice,
        })
    }


}

export default new ChainApiController();