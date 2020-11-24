'use strict';

const Controller = require('egg').Controller;
const { cb, filterQuery, createOrderId } = require('../utils/index');
const { QUERY_TABLES, QUERY_COUNT } = require('../utils/sql');

class OrderController extends Controller {
  // 根据用户ID查看订单列表
  async queryOrderListByAdminId() {
    const { ctx } = this;
    const isPass = {
      number: ['status', 'member_id'],
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

  // 确认订单返回商品
  async confirmOrder() {
    const { ctx } = this;
    let { table_num, people_num, goods = [] } = ctx.request.body;
    if (!table_num) {
      ctx.body = cb({ msg: '桌位号不能为空', code: 1000 });
      return;
    }
    if (!people_num) {
      ctx.body = cb({ msg: '就餐人数不能为空', code: 1000 });
      return;
    }
    if (goods && goods.length === 0) {
      ctx.body = cb({ msg: '还没有点菜', code: 1000 });
      return;
    }
    // 查询菜品的价格
    goods = await Promise.all([
      ...goods.map(async item => {
        let params = await ctx.service.product.queryProductInfoByOrderComfirm(item.id);
        item = { ...params, count: item.count };
        return item;
      })
    ])
    ctx.body = cb({ msg: '查询成功', data: goods });
  }
  // 创建订单
  async insertOrder() {
    const { ctx } = this;
    let { table_num, people_num, goods = [], remark = '' } = ctx.request.body;
    if (!table_num) {
      ctx.body = cb({ msg: '桌位号不能为空', code: 1000 });
      return;
    }
    if (!people_num) {
      ctx.body = cb({ msg: '就餐人数不能为空', code: 1000 });
      return;
    }
    if (goods && goods.length === 0) {
      ctx.body = cb({ msg: '还没有点菜', code: 1000 });
      return;
    }
    const admin_id = 1;
    const tea_price = people_num * 2; // 拟定茶位费一人2元
    let product_price = 0;
    let total_price = tea_price;
    // 查询菜品的价格
    goods = await Promise.all([
      ...goods.map(async item => {
        let params = await ctx.service.product.queryProductInfoByOrderComfirm(item.id);
        item = { ...params, count: item.count };
        product_price += (params.price * item.count);
        return item;
      })
    ])
    total_price+=product_price;
    const order_id = createOrderId(admin_id);
    const resultParams = {
      total_price:total_price,product_price, tea_price, people_num, remark, table_num,
      // 是否有优惠券 拟定没有
      real_price: total_price, order_id,
      // 暂时拟定
      admin_id, member_id: 1
    }
    const result = await ctx.service.order.insertOrder(resultParams);
    if (result.affectedRows && result.insertId) {
      await Promise.all([
        ...goods.map(async item => {
          await ctx.service.order.insertOrderSnapshot(result.insertId, item);
        })
      ])
      ctx.body = cb({ msg: '创建订单成功', data: order_id });
    } else {
      ctx.body = cb({ msg: '创建订单失败', code: 500 });
    }

  }

  async queryOrderInfoById() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    if (!id) {
      ctx.body = cb({ msg: '参数错误', code: 1000 });
      return;
    }
    let orderInfo = await ctx.service.order.queryOrderInfoById(id);
    if (orderInfo && orderInfo.id) {
      orderInfo.snapshotInfo = await ctx.service.order.queryOrderSnapshotById(orderInfo.id);
      ctx.body = cb({ data: orderInfo });
      return;
    } else {
      ctx.body = cb({ msg: '订单不存在', code: 500 });
      return;
    }
  }
}

module.exports = OrderController;