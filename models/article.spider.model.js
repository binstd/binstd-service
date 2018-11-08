import Sequelize from 'sequelize';

export default function (sequelize) {
    const article_spider = sequelize.define('article_spider', {
        //标题
        title: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true,
        },
        //内容
        content: {
            allowNull: true,
            type: Sequelize.TEXT, 
            unique: false,
        },
        //tag:json格式
        tags: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        description: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        //图片
        imgurl: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,

        },
        //作者
        author: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        //来源
        fromspider: {
            type: Sequelize.STRING,
        },
        fromurl: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
      
        // 0:未爬内容 1:已爬完 4:作废
        status: {
            allowNull: false,
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
            indexes: [
                // 在 email 上创建一个唯一索引
                {
                    unique: false,
                    fields: ['author']
                },

                // 在使用 jsonb_path_ops 的 operator 数据上创建一个 gin 索引
                {
                    fields: ['status'],
                    unique: false,    
                },

            ]
        }
    );
}

