'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.tokenHandler(app.config.jwt);

  // 活动资讯
  router.get('/activity/getRealTimeInfo', controller.activity.queryRealTimeInfo);
  router.get('/activity/getRealTimeDateils', controller.activity.getRealTimeDateils);
};