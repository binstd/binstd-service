import Sequelize from 'sequelize';

export default function(sequelize) {
  const user_contact = sequelize.define('user_contact', {
    contactName: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: false,
      validate: { isLowercase: true }
    },
    contactAddress: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
    },
    address: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: false,
        validate: { isLowercase: true }
    },

    user_id: {
        // allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        // defaultValue: () => Math.floor(Math.random() * 10000) // Initialize with a random nonce
    }
  });
}

