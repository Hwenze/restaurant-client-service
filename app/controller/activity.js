'use strict';

const Controller = require('egg').Controller;
const { cb, filterQuery } = require('../utils/index');

class ActivityController extends Controller {

    // 查询活动资讯列表
    async queryRealTimeInfo() {
        const { ctx } = this;
        const isPass = {
            string: ['title']
        };
        let params = filterQuery(ctx.query, isPass);
        const result = await ctx.service.activity.queryRealTimeInfo(params);
        if (result) {
            ctx.body = cb({ data: result });
            return;
        } else {
            ctx.body = cb({ code: 500 });
            return;
        }
    }

    // 查询活动资讯详情
    async getRealTimeDateils() {
        const { ctx } = this;
        const params = ctx.query.id;
        const result = await ctx.service.activity.getRealTimeDateils(params);
        if (result) {
            ctx.body = cb({ data: result });
            return;
        } else {
            ctx.body = cb({ code: 500 });
            return;
        }
    }

}

module.exports = ActivityController;