// const router = require('koa-router')()
import Router from 'koa-router';
import HomeController from './controller/home'
import ApiController from './controller/api'

const router = Router();
// const HomeController = require('./controller/home')

module.exports = (app) => {
    router.get( '/', HomeController.index )

    router.get('/home', HomeController.home)

    router.get('/home/:id/:name', HomeController.homeParams)

    router.get('/user', HomeController.login)

    router.post('/user/register', HomeController.register)

    router.get('/api/:id/:name', ApiController.hello)
    app.use(router.routes())
        .use(router.allowedMethods())
}