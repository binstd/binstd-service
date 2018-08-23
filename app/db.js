import Sequelize from 'sequelize';

import api_users from './models/user.model';

// const sequelize = new Sequelize(null, null, null, {
//   dialect: 'sqlite',
//   storage: '/tmp/db.sqlite',
//   logging: false
// });

const sequelize = new Sequelize('wallet', 'admin', 'wly3125965', {
    host: '144.202.53.64',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// Init all models
api_users(sequelize);

sequelize.sync();

export default sequelize;
