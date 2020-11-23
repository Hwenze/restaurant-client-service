'use strict';

const Controller = require('egg').Controller;
const { cb, filterQuery, createOrderId } = require('../utils/index');
const { QUERY_TABLES, QUERY_COUNT } = require('../utils/sql');

class OrderController extends Controller {
  // 根据店铺ID查看订单列表
  async queryOrderListByAdminId() {
    const { ctx } = this;
    const isPass = {
      number: ['status', 'order_id', 'member_id'],
    };
    let params = filterQuery(ctx.query, isPass);
    const result = await ctx.service.order.queryOrderListByAdminId(params);
    ctx.body = cb({ data: result });
  }

  async queryOrderInfoByOrderId() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    if (!id) {
      ctx.body = cb({ msg: '参数[id]不能为空', code: 1000 });
      return;
    }
    const { admin_id = '' } = await ctx.service.common.getUserInfo();
    const orderInfo = await ctx.service.order.queryOrderInfoById(id);
    if (orderInfo && admin_id === orderInfo.admin_id) {
      // 根据orderId去查询订单快照
      const productList = await ctx.service.order.queryOrderSnapshotById(orderInfo.id);
      const memberInfo = await ctx.service.member.queryMemberInfoById(orderInfo.member_id);
      delete memberInfo.admin_id;
      delete orderInfo.admin_id;
      ctx.body = cb({ data: { productList, orderInfo, memberInfo } });
      // let productInfos = await ctx.service.order.queryProductInfoById(orderInfo.id);
    } else {
      ctx.body = cb({ msg: '订单不存在', code: 500 });
    }
  }
}

module.exports = OrderController;