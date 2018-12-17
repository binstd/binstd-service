import Sequelize from 'sequelize';

export default function(sequelize) {
  const dapp_abi = sequelize.define('dapp_abi', {
    title: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    //   validate: { isLowercase: true }
    },
    contractName: {
        type: Sequelize.STRING,
        unique: false
    },
    description: {
        type: Sequelize.STRING,
        unique: false
    },
    imgUrl: {
        type: Sequelize.STRING,
        unique: false,
    },
    // abi文件
    abi: {
      type: Sequelize.JSON,
      unique: false
    },
    // abi文件
    translate: {
        type: Sequelize.JSON,
        unique: false
      },
    // 部署字节
    bytecode: {
        type: Sequelize.TEXT,
        unique: false,
    },
    // 状态0 无效，状态1 有效 
    status: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue:1
    }

  });
}

