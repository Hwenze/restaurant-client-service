/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1605063566141_1968';

  config.uploadOrgin = 'http://127.0.0.1:8080'

  // 上传地址
  config.uploadUrl = {
    image:'/app/public/image/',
    file:'/app/public/file/',
  }
  
  // 中间件
  config.middleware = ['errorHandler'];

  // 服务端口号
  config.cluster = {
    listen: {
      path: '',
      port: 8080,
      hostname: 'localhost',
    }
  };
  // 配置指定的前端地址
  config.cors = {
    // origin: '*',

    origin: ctx => ctx.get('origin'),
    // allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
    credentials: true,
  };

  config.security = {
    // 关闭csrf验证
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    // 白名单
    // domainWhiteList: ['*']
  }
  // sql配置
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '12345678',
      database: 'restaurant',
    }
  };

  // session
  config.session = {
    key: 'EGG_SESS',
    maxAge: 3 * 3600 * 1000, // 一周
    httpOnly: true,
    encrypt: true,
    renew: true   //每次刷新页面的时候 session都会被延期
  }

  config.jwt = {
    // key
    secret: 'restaurant',
    ignore: ['/login']
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
