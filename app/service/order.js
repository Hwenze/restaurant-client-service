// app/service/User.js
const Service = require('egg').Service;
const { cb, TREE, mkdir } = require('../utils/index');
const { QUERY_TABLES, QUERY_COUNT } = require('../utils/sql');
const path = require('path');

class OrderService extends Service {

  // 获取订单详情
  async queryOrderInfoById(id) {
    const { ctx, app } = this;
    return await app.mysql.get('order', { order_id: id });
  }

  // 获取订单快照详情
  async queryOrderSnapshotById(id) {
    const { ctx, app } = this;
    return await app.mysql.select('order_snapshot', {
      where: { order_id: id }
    });
  }

  // 获取订单列表
  async queryOrderListByAdminId(option) {
    const { ctx, app } = this;
    const { page, column } = option;
    const { admin_id = '' } = await ctx.service.common.getUserInfo();
    // 该返回的字段
    const orderColumn = ['id', 'order_id', 'total_price', 'create_time', 'status', 'table_num', 'people_num'];
    const orderListResult = await app.mysql.query(QUERY_TABLES(
      [
        {
          table: 'order',
          column: orderColumn,
          where: { admin_id, ...column }
        },
        {
          table: 'member',
          column: ['id as member_id', 'nickname'],
          where: '`order`.member_id = `member`.id'
        }
      ], page
    ));
    const totalResult = await app.mysql.query(QUERY_COUNT([
      {
        table: 'order',
        column: orderColumn,
        where: { admin_id, ...column }
      },
    ]));
    return {
      list: orderListResult,
      total: totalResult.total || 0,
      ...page
    };
  }

}

module.exports = OrderService;