import Sequelize from 'sequelize';

import api_users from './models/user.model';
import user_dapp_info from './models/dapp.info.model'
import user_contact from './models/user.contact.model'
import more_transfer from './models/moretransfer.model';

//载入配置文件
import prd_config from './utils/prdConfig'

//判断是否载入正式环境配置
if (Object.keys(prd_config).length == 0) { 
    //prd_config为空
    console.log('node_env is:', process.env.NODE_ENV);
} else {
    //prd_config不为空
    console.log(prd_config);
  
}

//console.log('\n \n env: \n',app.env);

const sequelize = new Sequelize('d57eko2bomf4t3', 'qdgcpndksdlevz', '17a866b7f00703519c0cfaf0b493ece3977144bfcc492c21c9ed4e8a9322f839', {
    host: 'ec2-54-243-147-162.compute-1.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: false
});

// Init all models
api_users(sequelize);
user_dapp_info(sequelize);
user_contact(sequelize);
more_transfer(sequelize);
sequelize.sync();

export default sequelize;
