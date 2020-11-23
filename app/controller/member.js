'use strict';

const Controller = require('egg').Controller;
const { cb, TREE } = require('../utils/index');

class UserController extends Controller {

  // 根据店铺id返回运营列表
  async queryUserListByAdminId() {
    const { ctx } = this;
    const { pageSize = 10, current = 1 } = ctx.query;
    const result = await ctx.service.operate.queryUserListByAdminId({ pageSize, current });
    if (result) {
      ctx.body = cb({ data: result });
      return;
    } else {
      ctx.body = cb({ code: 500 });
      return;
    }
  }



  // 冻结 or 解冻用户
  async changeUserStatus() {
    const { ctx } = this;
    const { uid } = ctx.request.body;
    // 查询操作者信息
    const { admin_id = '', id = '' } = await ctx.service.common.getUserInfo();
    if (uid == id) {
      ctx.body = cb({ code: 500, msg: '无法操作自己' });
      return;
    }
    // 查询被操作的用户信息
    const targetUser = await ctx.service.user.queryInfoByUserId(uid);
    if (targetUser) {
      // 非店铺信息
      if (targetUser.admin_id !== admin_id) {
        ctx.body = cb({ code: 500, msg: '无权操作' });
        return;
      } else {
        const result = await ctx.service.user.changeUserStatus(targetUser.id, targetUser.status === 1 ? 0 : 1);
        ctx.body = cb(result ? { msg: '修改成功' } : { code: 500, msg: '修改失败' });
      }
    } else {
      ctx.body = cb({ code: 500, msg: '用户不存在' });
    }
  }



  // 删除用户
  async deleteUserById() {
    const { ctx } = this;
    const { uid } = ctx.request.body;
    // 查询操作者信息
    const { admin_id = '', id = '' } = await ctx.service.common.getUserInfo();
    // 查询被操作的用户信息
    if (uid == id) {
      ctx.body = cb({ code: 500, msg: '无法删除自己' });
      return;
    }
    const targetUser = await ctx.service.user.queryInfoByUserId(uid);
    if (targetUser) {
      // 非店铺信息
      if (targetUser.admin_id !== admin_id) {
        ctx.body = cb({ code: 500, msg: '无权操作' });
        return;
      } else {
        const result = await ctx.service.user.deleteUserById(targetUser.id);
        ctx.body = cb(result ? { msg: '删除成功' } : { code: 500, msg: '删除失败' });
      }
    } else {
      ctx.body = cb({ code: 500, msg: '用户不存在' });
    }
  }
}

module.exports = UserController;
