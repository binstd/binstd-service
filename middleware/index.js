// const nunjucks = require('koa-nunjucks-2')
// const staticFiles = require('koa-static')
// const path = require('path')


import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors';

// const bodyParser = require('koa-bodyparser')
import Send from  './send-json'

import Log from './log'
import ip from 'ip'
import apiError from './api-error' 
module.exports = (app) => {
    
    app.use(cors({
        origin: function (ctx) {
            return "*"; // 允许来自所有域名请求
        },
        exposeHeaders: ['Content-Range', 'WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'User-Agent'],
        allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    }))

    // app.use(cors());

    // app.use(cors({
    //     origin: function (ctx) {
    //         return '*'; 
    //     },
    //     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    //     maxAge: 5,
    //     credentials: true,
    //     allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    //     allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    // }));

    //载入中间件
     // 日志中间件
    app.use(Log({
            env: app.env,  // koa 提供的环境变量
            projectName: 'koa2-tutorial',
            appLogLevel: 'debug',
            dir: 'logs',
            serverIp: ip.address()
    }));
   
    //载入send中间件
    app.use(Send());
    
    app.use(apiError())
  
    //载入 bodyparser中间件
    app.use(bodyParser());
  
 
  
}