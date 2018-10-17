# Bnstd服务层 文档说明

## 部署
**环境要求**
+ nodejs 8.11.0+
+ postgresql 9.0+

#### 启动步骤
**安装依赖:**
```js
npm i
```
** 启动:**
开发环境
```js
npm run start
```
线上环境
```js
npm run prd
```

#### ** docker下**
 安装docker 
 git clone -b v2 https://github.com/binstd/binstd-service  
 cd binstd-service/   
 sudo docker build -t binstd-service .
 运行测试:
 sudo docker run -p 80:3000 binstd-servic
 正式:
 sudo docker run -d -p 80:3000 binstd-service
 
 可自行修改docker的


## 核心代码二次开发
#### 代码结构
+ Controller/\* (控制器目录)
+ middleware/\*  (所有中间件所在的目录)
+ middleware/index.js (载入中间件)
+ model/\* (sequelize的model模型)
+ utils/\*  (工具库辅助方法所在,也可以放置一些配置)
+ Config.js (系统核心配置,如数据库,连接区块链rpc接口)
+ router.js (所有的路由规则所在)

#### 核心依赖的第三方模块
+ koa-router (路由)
+ koa-jwt (jwt验证)
+ sequelize (数据库orm库 支持mysql,postgresql,mongodb等)




