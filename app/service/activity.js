// app/service/User.js
const Service = require('egg').Service;
const { cb, TREE } = require('../utils/index');

class CommonService extends Service {

  // 查询活动资讯列表
  async queryRealTimeInfo(option) {
    const { ctx, app } = this;
    const { page = {}, column = {} } = option;
    const { pageSize = 10, current = 0 } = page;
    const result = await app.mysql.select('real_time_info', {
      where: { ...column }, // WHERE 条件
      orders: [['star_time', 'desc']], // 排序方式
      limit: pageSize,
      offset: current * pageSize, // 数据偏移量
    });
    const total = await app.mysql.count('real_time_info', { ...column });

    return {
      list: result,
      total: total || 0,
      current,
      pageSize
    };
  }

  // 查询活动资讯详情
  async getRealTimeDateils(id) {
    const { app } = this;
    return await app.mysql.get('real_time_info', { id });
  }

}

module.exports = CommonService;
