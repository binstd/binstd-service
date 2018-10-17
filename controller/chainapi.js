import sequelize from '../db';
import config from '../config';

import ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Web3 from 'web3';

import abiDecoder from 'abi-decoder'
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
        // console.log('gasprice:', gasprice);
        ctx.apidata({
            wei: gasprice,
        })
    }

    /**
     * @api 根据指定地址和合约查询交易记录
     */
    async getTokentxList(ctx, next) {
        var resultData = [];
        let param = {};
        if(ctx.query.contract_address){ //erc20 
            param['module'] = "account";
            param['action'] = "tokentx";
            param['contractaddress'] = ctx.query.contract_address; //"0xdd974D5C2e2928deA5F71b9825b8b646686BD200";
        }else{ //eth
            param['module'] = "account";
            param['action'] = "txlist";
        }
        
        param['address'] = ctx.query.address; //"0x81D723361d4F3e648F2c9c479d88DC6dEBF4fA5f";
        param['page'] = 1; //页数
        param['offset'] = 8;//数量
        param['sort'] = "desc";
        param['apikey'] = config.etherscan_api_key;
        
        //console.log(param);
        let response = await axios.get(config.etherscan_url[ctx.query.chain], {
            params: param
        });
        //console.log('response',response);
        if( response.data.status == 1) {
            var result = response.data.result;
            
            for(let i = 0; i< result.length; i++ ){
                let item = {};
                // console.log('oi',i);
                item.from = result[i].from;
                item.to = result[i].to;
                item.tokenSymbol = result[i].tokenSymbol;
                item.value = result[i].value
                item.hash = result[i].hash
                item.tx_cost = result[i].gasPrice*result[i].gasUsed;
                resultData.push(item);
                // console.log('\n item:',item);
            }
        }
        //console.log('resultData: \n',resultData);
        ctx.apidata({data:result});  
    }
    /**
     * @api 获取指定hash的交易记录
     * 测试网,部署合约: 0x1f4c8864efa774063a9a36be1c53c26d8bb5b6083427371ea64bfe5a6c22db5e
     * 交易记录:0x4bd0e5cde49abbaad91082f56cd0a42a1c090c1f0eb2e9cd8e58b5a56bcac2fc
     */
    async getTokentx(ctx, next) {

        // console.log(ctx.params.hash);
        let web3 = new Web3(new Web3.providers.HttpProvider(config.rpcurl[ctx.query.chain]));
        let transactionInfo = await web3.eth.getTransaction(ctx.params.hash);
        //web3.eth.getTransactionReceipt(ctx.params.hash).then(console.log);
        console.log(transactionInfo);
        abiDecoder.addABI(config.erc20abi);
        let result = abiDecoder.decodeMethod(transactionInfo.input);
        console.log(result);
       // console.log(web3.utils.hexToAscii(transactionInfo));
        // let transactionInfo = {};
        // transactionInfo.from = result.from;
        // transactionInfo.to = result.to;
        // //transactionInfo.tokenSymbol = result[i].tokenSymbol;
        // transactionInfo.value = result.value
        // item.hash = result[i].hash
        // item.tx_cost = result.cumulativeGasUsed*result.gasUsed;
        ctx.apidata({data:transactionInfo});  
    }


}

export default new ChainApiController();