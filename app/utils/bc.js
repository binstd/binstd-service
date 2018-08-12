var BigNumber = require('bignumber.js');
//初始化过程
var Web3 = require('web3');
import {blockchainconfig} from './bcconfig'
var Ether = new BigNumber(10e+17);


function formatAmount(amount) {
    var ret = new BigNumber(amount.toString());

    return ret.dividedBy(Ether) + " ETH";
}
module.exports = formatAmount;


function isconnecteth(url) {
    
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
        web3 = new Web3(new Web3.providers.HttpProvider(url));
    }
   return web3;
}

function getweb3() {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        return web3;
    } else {   
        let len = blockchainconfig.eth.length;
        let web3; 
        for (let i = 0; i < len; ++i) {
            if(i>0){
                console.log('dadadadada /n');
            }
            console.log(blockchainconfig.eth[i]);
            web3 = new Web3(new Web3.providers.HttpProvider(blockchainconfig.eth[i])); 
            if(web3.currentProvider.connected){
                
                break; 
            }
        }      
        //console.log('connect:',web3);
        return web3;
    }

}

module.exports = {
    isconnecteth,
    formatAmount,
    getweb3
}