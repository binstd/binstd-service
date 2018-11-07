import {dbspider} from '../db';
import config from '../config';
import Sequelize from 'sequelize';

import jwt from 'jsonwebtoken';
const article_spider = dbspider.models.article_spider;
const tags_spider =  dbspider.models.tags_spider;
class SpiderApiController {
 
    /**
     * @api {get} /
     */
    async getArticle(ctx, next) {
        //console.log('request.body:', ctx.request.body);
        let resultData = await article_spider.findAll(); 
        console.log(resultData);
        ctx.send(resultData);
    }


    async getSpiders(ctx, next) {
        //{ filter: '{"q":"rust"}', range: '[0,9]', sort: '["id","DESC"]' }
        // console.log(ctx.query.range);
        let returnData = [];
        let resultData = [];
        let pagedata = JSON.parse(ctx.query.range);
        let sort = JSON.parse(ctx.query.sort);
        
        if(ctx.query.filter == "{}"){
            resultData = await article_spider.findAll({ order: [sort], raw: true, offset: pagedata[0]+1, limit: pagedata[1]-pagedata[0]});
        }else{
            let filter = JSON.parse(ctx.query.filter);
            resultData = await article_spider.findAll({ 
                where: {
                    title: {
                      [Sequelize.Op.iLike]: `%${filter['q']}%`
                    }
                },
                order: [sort], 
                raw: true, 
                offset: pagedata[0]+1, 
                limit: pagedata[1]-pagedata[0]
            });
        }
       
        for( let data of resultData)  {
            let item = Object.assign({}, data);
            console.log(item);
            switch(data['status']) {
              case 1: 
                item['status_name'] = '已爬内容'; 
                break;
              case 3:
                item['status_name'] = '已审核'; 
                break;   
              case 4:
                item['status_name'] = '作废'; 
                break; 
             default:
                item['status_name'] = '未爬内容';  
            }
            if(item['tags']){
                item['tags'] = item['tags'].split(',');
            }
            //data['status']
            returnData.push(item);
        }
        
        //console. 
        ctx.set("Content-Type", "application/json");
        ctx.set("Content-Range", "posts 0-24/319");
        ctx.body = JSON.stringify(returnData)  
    }

    /**
     * 
     */
   async getOneSpiders(ctx, next) {
       
       let resultData = await article_spider.findById(ctx.params.id,{raw: true});
   
        // console.log(resultData);
       switch (resultData['status']) {
           case 1:
                resultData['status_name'] = '已爬内容';
               break;
           case 3:
                resultData['status_name'] = '已审核';
               break;
           case 4:
                resultData['status_name'] = '作废';
               break;
           default:
                resultData['status_name'] = '未爬内容';

       }
       if(resultData['tags']){
            resultData['tags'] = resultData['tags'].split(',');
       }
       ctx.set("Content-Type", "application/json");
       ctx.set("Content-Range", "posts 0-24/319");
       ctx.body = JSON.stringify(resultData)  
   }

    /**
     *   @api {post} ../..
     */
    async patchSpiders(ctx, next) {
        // console.log('wowoooooo!! \n \n wwwwww');
        // console.log(ctx.request.body);
        // ctx.set("Content-Range", "posts 0-24/319");
        let postData  = ctx.request.body
        postData['tags'] = postData['tags'].join(',');
        // console.log(postData['tags']);
        let resultData= await article_spider.findById(ctx.params.id)
        .then(article_spider => {
            Object.assign(article_spider, postData);
            return article_spider.save();
        });
        console.log('returnData:\n',resultData.dataValues);
        let returnData = resultData.dataValues;
        if(returnData['tags']){
            returnData['tags'] = returnData['tags'].split(',');
        }
        // let returnData = [];
        // console.log(returnData);
        console.log('\n \n \n \n \n ==========================我和我不一样的烟火 \n \n ');
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Content-Type", "application/json");
        ctx.body = JSON.stringify(returnData)  
    }


    // api/spiderstags?filter=
    async getSpidersTags(ctx, next) {
        // let returnData = [];
        let resultData = [];
        let sort = [];
        let pagedata = [];
        if(ctx.query.range){
            pagedata = JSON.parse(ctx.query.range);
        }
        if(ctx.query.sort){
            sort = JSON.parse(ctx.query.sort);
            console.log(typeof sort);
        }
       
        if(ctx.query.filter == "{}" || !ctx.query.filter){
            resultData = await tags_spider.findAll({ order: [sort], raw: true, offset: pagedata[0]+1, limit: pagedata[1]-pagedata[0]});
        }else{
            
            let filter = JSON.parse(ctx.query.filter);
            if(filter['q']) {
                resultData = await tags_spider.findAll({ 
                    where: {
                        tag: {
                          [Sequelize.Op.iLike]: `%${filter['q']}%`
                        }
                    },
                    order: [sort], 
                    raw: true, 
                    offset: pagedata[0]+1, 
                    limit: pagedata[1]-pagedata[0]
                });
            } else if(filter['id']) {
                // console.log(filter['id'][0]);
                // console.log(typeof filter['id'])
                resultData = await tags_spider.findAll({
                    where: {
                        tagname: {
                            [Sequelize.Op.or]: filter['id']
                      }
                    }
                });
            }
           
        }
       
        
        //console. 
        ctx.set("Content-Type", "application/json");
        ctx.set("Content-Range", "posts 0-24/319");
        ctx.body = JSON.stringify(resultData)  
    }

    /**
     * 
     */
   async getOneSpidersTags(ctx, next) {
       let resultData = await tags_spider.findById(ctx.params.id,{raw: true});
       ctx.set("Content-Type", "application/json");
       ctx.set("Content-Range", "posts 0-24/319");
       ctx.body = JSON.stringify(resultData)  
   }

    /**
     *   @api {post} ../..
     */
    async patchSpidersTags(ctx, next) {
        console.log('wowoooooo!! \n \n wwwwww');
        // ctx.set("Content-Range", "posts 0-24/319");
        let returnData= await tags_spider.findById(ctx.params.id)
        .then(tags_spider => {
            Object.assign(tags_spider, ctx.request.body);
            return tags_spider.save();
        });
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Content-Type", "application/json");
        ctx.body = JSON.stringify(returnData)  
    }
}

export default new SpiderApiController();

