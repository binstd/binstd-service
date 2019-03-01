import Sequelize from 'sequelize';

export default function(sequelize) {
  const api_users = sequelize.define('api_users', {
    nonce: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: () => Math.floor(Math.random() * 10000) // Initialize with a random nonce
    },
    publicAddress: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      validate: { isLowercase: true }
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    telephone:{
        type: Sequelize.STRING,
        unique: true,
    },
    email:{
        type: Sequelize.STRING,
      },
  });
}
