import tokenjson  from './utils/erc20.json'
/**
 *  拓展方式:将来改成eth_main: get_rpc('eth_main')这种形式
 *  get_rpc动态获取最快速的节点
 */
const rpcurl = {
    'eth_main': 'https://mainnet.infura.io/v3/0045c2ce288a4e649a8f39f3d19446b4',
    'eth_ropsten':'https://ropsten.infura.io/v3/0045c2ce288a4e649a8f39f3d19446b4',
    'eth_error': 'https://mainnet.xx/'  //调试用,错误地址
    
}
const config = {
    //jwt签名
    secret: 'shhhh', // TODO Put in process.env
    //不同链对应的默认rpc地址
    rpcurl,
    //erc20的abi
    erc20abi:tokenjson.abi
};
export default config;
  