import Sequelize from 'sequelize';

export default function(sequelize) {
  const user_dapp_info = sequelize.define('user_dapp_info', {
    publicAddress: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: false,
      validate: { isLowercase: true }
    },
    dappName: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
    },
    contractAddress: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: false,
        validate: { isLowercase: true }
    },
    contractInfo: {
        type: Sequelize.STRING
    },
    dappChain: {
      type: Sequelize.STRING,
      unique: false
    }
  });
}

