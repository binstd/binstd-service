import Sequelize from 'sequelize';

export default function(sequelize) {
  const tags_spider = sequelize.define('tags_spider', {
    tagname: {
      type: Sequelize.STRING,
      unique: true
    },
    fathername: {
        type: Sequelize.STRING,
        unique: false
    },
    fatherid: {
        type: Sequelize.STRING,
        unique: false 
    },
    status: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    }
  });
}
