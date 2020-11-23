// app/service/User.js
const Service = require('egg').Service;
const { cb, TREE, mkdir } = require('../utils/index');
const path = require('path');

class CommonService extends Service {

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    let userinfo = {};
    try {
      userinfo = await app.jwt.verify(token, app.config.jwt.secret); // 解析用户token
    } catch (error) {
      console.log('获取用户信息失败', error);
    }
    if (userinfo.id) {
      return await app.mysql.get('admin_userinfo', { id: userinfo.id, status: 1 });
    } else {
      ctx.body = cb({ code: 401 });
    }
  }

  // 查询用户协议
  async queryuserAgreement(id) {
    const { app } = this;
    return await app.mysql.get('user_agreement', { id });
  }

  // 获取上传的文件夹名称
  async getUploadFileDirname(stream) {
    const { app, ctx } = this;
    const timer = new Date();
    // 文件夹
    const imageType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    let rootPath = '';
    if (imageType.indexOf(stream.mime) !== -1) {
      rootPath = app.config.uploadUrl.image;
    } else {
      rootPath = app.config.uploadUrl.file;
    }
    const day = `${timer.getFullYear()}${timer.getMonth() + 1}${timer.getDate() > 10 ? timer.getDate() : '0' + timer.getDate()}`;
    const filename = (new Date().getTime() + Math.random().toString(36).substr(4) + path.extname(stream.filename).toLocaleLowerCase());
    // const resultPath = path.join(rootPath, day);
    // 测试地址
    const resultPath = path.join(__dirname,'../public/')+day;
    // 检查是否存在文件夹 不存在就新建
    await mkdir(resultPath);
    // 系统路径
    const systemPath = path.join(resultPath, filename);
    return {
      image:`/${day}/${filename}`,
      systemPath,
      imageUrl: ctx.origin + systemPath.slice(3).replace(/\\/g, '/'),
    };
  }

  // 查询首页轮播
  async queryHomeRotation(column) {
    const { app } = this;
    return await app.mysql.select('home_rotation', {
      where: { status:1 }, // WHERE 条件
      orders: [['sort', 'desc']], // 排序方式
    });
  }

}

module.exports = CommonService;
