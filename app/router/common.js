'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.tokenHandler(app.config.jwt);
  router.get('/api/getAgreement', controller.common.queryuserAgreement);
  // router.post('/api/uploadImage', controller.common.uploadImage);
  router.get('/api/getHomeRotation', controller.common.queryHomeRotation);
};

