'use strict';

const Controller = require('egg').Controller;
const { cb, filterQuery } = require('../utils/index');
const pump = require('mz-modules/pump');
const path = require('path');
const fs = require('fs');

class CommonController extends Controller {

    // 查询用户协议
    async queryuserAgreement() {
        const { ctx } = this;
        const result = await ctx.service.common.queryuserAgreement(1);
        if (result) {
            ctx.body = cb({ data: result });
            return;
        } else {
            ctx.body = cb({ code: 500 });
            return;
        }
    }

    // 上传组件
    async uploadImage() {
        const { ctx, app } = this;

        const parts = ctx.multipart({ autoFields: true });
        let files = {};
        // 文件流
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {
                break;
            }
            // 上传图片的目录
            const dir = await ctx.service.common.getUploadFileDirname(stream);
            const target = dir.systemPath;
            // 将图片存进库
            const writeStream = fs.createWriteStream(target);
            // 结束
            await pump(stream, writeStream);

            files = {
                image: dir.image,
                url: `${app.config.uploadOrgin}/public${dir.image}`,
                orgin: dir.imageUrl,
                system: dir.systemPath
            }
            
        }
        if(files.url){
            ctx.body = cb({ data: files });
        }else{
            ctx.body = cb({ msg:'上传失败' });
        }
    }

    // 查询首页轮播
    async queryHomeRotation() {
        const { ctx } = this;
        const result = await ctx.service.common.queryHomeRotation();
        if (result) {
            ctx.body = cb({ data: result });
            return;
        } else {
            ctx.body = cb({ code: 500 });
            return;
        }
    }

    // 查询首页热门店铺
    async queryHomeShop() {
        const { ctx } = this;
        const result = await ctx.service.common.queryHomeShop();
        if (result) {
            ctx.body = cb({ data: result });
            return;
        } else {
            ctx.body = cb({ code: 500 });
            return;
        }
    }

    // 查询店铺列表
    async queryShopList() {
        const { ctx } = this;
        const isPass = {
            string: ['shop_name']
        };
        let params = filterQuery(ctx.query, isPass);
        console.log(params)
        const result = await ctx.service.common.queryShopList(params);
        if (result) {
            ctx.body = cb({ data: result });
            return;
        } else {
            ctx.body = cb({ code: 500 });
            return;
        }
    }

}

module.exports = CommonController;