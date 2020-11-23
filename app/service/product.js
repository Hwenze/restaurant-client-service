// app/service/User.js
const Service = require('egg').Service;
const { cb, TREE } = require('../utils/index');

class ProductService extends Service {

  // 根据分类id查询商品
  async queryProductListByCategoryId(admin_id, category_ids) {
    const { app } = this;
    return await app.mysql.select('product', {
      where: { admin_id, category_ids, status: 1 }, // WHERE 条件
    });
  }

  // 查询商品
  async queryProductInfoById(id) {
    const { app } = this;
    return await app.mysql.get('product', { id });
  }

  // 根据admin_id查询分类列表
  async queryCategoryByAdminId(admin_id) {
    const { app, ctx } = this;
    return await app.mysql.select('admin_category', {
      columns: ['id', 'name', 'create_time', 'image',],
      where: { admin_id, status: 1, }, // WHERE 条件
    });

  }

  // 更新商品
  async updateProductInfo(column) {
    const { app, ctx } = this;
    const { id, ...query } = column;
    const result = await app.mysql.update('product', { ...query }, {
      where: { id }, // WHERE 条件
    });
    return result.affectedRows === 1;
  }
}

module.exports = ProductService;
