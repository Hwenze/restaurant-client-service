'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // 数据库
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  // token管理
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  // 跨域白名单
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
