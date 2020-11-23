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
      ctx.body = cb({ msg: '参数错误', code: 1000 });
      return;
    }
    const admin_id = 1;
    // const { admin_id = '' } = await ctx.service.common.getUserInfo();
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
    // 获取商品分类列表
    const admin_id = 1;
    // 分类列表
    const categoryList = await ctx.service.product.queryCategoryByAdminId(admin_id);
    // 商品列表
    await Promise.all([
      ...categoryList.map(async item=>{
        item.productList = await ctx.service.product.queryProductListByCategoryId(admin_id, item.id);
        return item;
      })
    ])
    ctx.body = cb({
      data: categoryList
    });
  }
}

module.exports = ProductController;