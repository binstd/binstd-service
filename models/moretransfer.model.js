import Sequelize from 'sequelize';

/**
 * 批量转账
 * toAddress 转账目标,fromAddress转账人,dappId 应用id,chain区块链网络,amount:金额,
 */
export default function(sequelize) {
  const more_transfer = sequelize.define('more_transfer', {
    toAddress: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    //   validate: { isLowercase: true }
    },
    fromAddress: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: false,
        // validate: { isLowercase: true },
    },
    dappId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: false,
    },
    contactName: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: false,
    },
    chain: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true,
        validate: { isLowercase: true }
    },
    amount: {
        type: Sequelize.STRING,
        unique: false,
    },
    status: {
      type: Sequelize.INTEGER,
      unique: true,
      defaultValue:0
    }
  });
}

