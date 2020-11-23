// app/service/User.js
const Service = require('egg').Service;
const { cb, TREE } = require('../utils/index');

class ProductService extends Service {

  // 查询商品
  async queryProductInfoById(id) {
    const { app } = this;
    return await app.mysql.get('product', { id });
  }

  // 查询商品分类
  async queryCategoryInfoById(id) {
    const { app } = this;
    return await app.mysql.get('admin_category', { id });
  }

  // 根据admin_id查询分类列表
  async queryCategoryByAdminId(query) {
    const { app, ctx } = this;
    const { admin_id = '' } = await ctx.service.common.getUserInfo();
    const { page = {}, column = {} } = query;
    const { pageSize = 10, current = 0 } = page;
    // console.log(query,admin_id);
    const result = await app.mysql.select('admin_category', {
      columns: ['id', 'name', 'create_time', 'sort', 'status', 'image', 'operator'],
      where: { admin_id, ...column }, // WHERE 条件
      orders: [['sort', 'desc']], // 排序方式
      limit: pageSize,
      offset: pageSize * current, // 数据偏移量
    });
    if (pageSize < 200) {
      const total = await app.mysql.count('admin_userinfo', { admin_id, ...column });

      return {
        list: result,
        total: total || 0,
        current,
        pageSize
      };
    } else {
      return result;
    }

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

  // 创建商品
  async insertProduct(column) {
    const { app, ctx } = this;
    const { id = '', admin_id = '' } = await ctx.service.common.getUserInfo();
    const result = await app.mysql.insert('product', {
      operator: id, admin_id, ...column
    });
    return result;
  }

  // 查询商品列表
  async queryProductListAdminId(option) {
    // 根据店铺身份查询该店员工列表
    const { ctx, app } = this;
    const userinfo = await ctx.service.common.getUserInfo();
    const admin_id = userinfo.admin_id;
    const { page = {}, column = {} } = option;
    const { pageSize = 10, current = 0 } = page;
    const result = await app.mysql.select('product', {
      where: { admin_id, ...column }, // WHERE 条件
      column: ['id', 'title', 'sub_title', 'price', 'create_time', 'status', 'banner'],
      orders: [['id', 'desc']], // 排序方式
      limit: pageSize,
      offset: current * pageSize, // 数据偏移量
    });
    const total = await app.mysql.count('product', { admin_id, ...column });

    return {
      list: result,
      total: total || 0,
      current,
      pageSize
    };

  }

  // 商品上下架
  async changeProductStatus(id, status) {
    const { app } = this;
    const result = await app.mysql.update('product', {
      status: status
    }, {
      where: { id }
    })
    return result.affectedRows === 1;
  }

  // 商品上下架
  async changeCategoryStatus(id, status) {
    const { app } = this;
    const result = await app.mysql.update('admin_category', {
      status: status
    }, {
      where: { id }
    })
    return result.affectedRows === 1;
  }

  // 更新分类
  async updateCategory(column) {
    const { app, ctx } = this;
    const { id, ...query } = column;
    const result = await app.mysql.update('admin_category', query, {
      where: { id }
    })
    return result.affectedRows === 1;
  }

  // 创建分类
  async insertCategory(column) {
    const { app, ctx } = this;
    const { id = '', admin_id = '' } = await ctx.service.common.getUserInfo();
    const result = await app.mysql.insert('admin_category', {
      operator: id, admin_id, ...column
    });
    return result.affectedRows === 1;
  }

}

module.exports = ProductService;
