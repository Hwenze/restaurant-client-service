// app/service/User.js
const Service = require('egg').Service;
const { cb, TREE } = require('../utils/index');
const { QUERY_TABLES, QUERY_COUNT } = require('../utils/sql');
const path = require('path');

class MemberService extends Service {

  // 获取会员信息
  async queryMemberInfoById(id) {
    const { ctx, app } = this;
    return await app.mysql.get('member', { id: id });
  }

}

module.exports = MemberService;
