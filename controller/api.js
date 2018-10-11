import sequelize from '../db';
// import config from './utils/config';
const api_users = sequelize.models.api_users;
const user_dapp_info = sequelize.models.user_dapp_info;
const user_contact = sequelize.models.user_contact;

class ApiController {
    async hello(ctx, next) {
        console.log('request.body:', ctx.request.body);
        let jsondata = await api_users.create(ctx.request.body);  
        console.log(ctx.params)
        console.log('customCode:',ctx.customCode.CONTRACT_ADDRESS_ERROR);
        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
        });
        //示范
        // ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR)
        ctx.send(jsondata)
    }
    
}

export default new ApiController();