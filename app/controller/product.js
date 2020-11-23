'use strict';

const Controller = require('egg').Controller;
const { cb, filterQuery } = require('../utils/index');

class ProductController extends Controller {
  // 根据商品id查询商品信息
  async queryProductInfoById() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    if (!id) {
      ctx.body = cb({ msg: '参数[id]不能为空', code: 1000 });
      return;
    }
    const { admin_id = '' } = await ctx.service.common.getUserInfo();
    let productInfo = await ctx.service.product.queryProductInfoById(id);
    if (productInfo && admin_id === productInfo.admin_id) {
      let categoryIds = productInfo.category_ids && productInfo.category_ids.split ? productInfo.category_ids.split(',') : []
      let operatorInfo = await ctx.service.user.queryInfoByUserId(productInfo.operator);
      delete productInfo.admin_id;
      productInfo.category_ids = categoryIds;
      productInfo.operator = operatorInfo.nickname || '';
      return ctx.body = cb({ data: productInfo });
    } else {
      ctx.body = cb({ msg: '商品不存在', code: 500 });
    }
  }

  // 根据admin_id查询分类列表
  async queryCategoryByAdminId() {
    const { ctx } = this;
    const isPass = {
      string: ['name'],
      number: ['id', 'status', 'sort']
    }
    const query = filterQuery(ctx.query, isPass);
    let categoryList = await ctx.service.product.queryCategoryByAdminId(query);

    ctx.body = cb({ data: categoryList });
  }

  // 保存或创建商品
  async updateOrInsertProduct() {
    const { ctx } = this;
    const isPass = {
      number: ['id'],
      string: ['title', 'banner', 'category_ids', 'sub_title', 'desc', 'price']
    }
    let { column } = filterQuery(ctx.request.body, isPass);
    if (column.category_ids && Array.isArray(column.category_ids)) {
      column.category_ids = column.category_ids.join(',');
    }
    if (column.id) {
      const result = await ctx.service.product.updateProductInfo(column);
      ctx.body = cb({ msg: result ? '保存成功' : '保存失败' });
    } else {
      const insertReuslt = await ctx.service.product.insertProduct(column);
      if (insertReuslt && insertReuslt.affectedRows === 1) {
        ctx.body = cb({ msg: '创建成功', data: insertReuslt });
      } else {
        ctx.body = cb({ msg: '创建失败' });
      }

    }

  }

  // 获取商品列表
  async queryProductListAdminId() {
    const { ctx } = this;
    const isPass = {
      number: ['status', 'id'],
      string: ['title', 'sub_title']
    };
    let params = filterQuery(ctx.query, isPass);
    const result = await ctx.service.product.queryProductListAdminId(params);
    if (result) {
      ctx.body = cb({ data: result });
      return;
    } else {
      ctx.body = cb({ code: 500 });
      return;
    }
  }

  // 上下架商品
  async changeProductStatus() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    // 查询操作者信息
    const { admin_id = '' } = await ctx.service.common.getUserInfo();
    // 查询被操作的用户信息
    const productInfo = await ctx.service.product.queryProductInfoById(id);
    if (productInfo && productInfo.admin_id === admin_id) {
      const result = await ctx.service.product.changeProductStatus(productInfo.id, productInfo.status === 1 ? 0 : 1);
      ctx.body = cb(result ? { msg: '操作成功' } : { code: 500, msg: '操作失败' });
    } else {
      // 非店铺信息
      ctx.body = cb({ code: 500, msg: '商品不存在' });
    }
  }

  // 上下架分类
  async changeCategoryStatus() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    // 查询操作者信息
    const { admin_id = '' } = await ctx.service.common.getUserInfo();
    // 查询被操作的用户信息
    const categoryInfo = await ctx.service.product.queryCategoryInfoById(id);
    if (categoryInfo && categoryInfo.admin_id === admin_id) {
      const result = await ctx.service.product.changeCategoryStatus(categoryInfo.id, categoryInfo.status === 1 ? 0 : 1);
      ctx.body = cb(result ? { msg: '操作成功' } : { code: 500, msg: '操作失败' });
    } else {
      // 非店铺信息
      ctx.body = cb({ code: 500, msg: '分类不存在' });
    }
  }
  // 添加或者保存商品分类
  async updateOrInsertCategory() {

    const { ctx } = this;
    const isPass = {
      number: ['id'],
      string: ['name', 'image', 'desc']
    }
    const { column } = filterQuery(ctx.request.body, isPass);
    if (column.id) {
      const updateResult = await ctx.service.product.updateCategory(column);
      ctx.body = cb({ msg: updateResult ? '保存成功' : '保存失败' });
    } else {
      const insertReuslt = await ctx.service.product.insertCategory(column);
      ctx.body = cb({ msg: insertReuslt ? '创建成功' : '创建失败' });
    }
  }
}

module.exports = ProductController;