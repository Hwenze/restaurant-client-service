'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.tokenHandler(app.config.jwt);
  router.get('/api/getAgreement', controller.common.queryuserAgreement);
  router.post('/api/setAgreement',  controller.common.updateuserAgreement);
  // router.post('/api/uploadImage', controller.common.uploadImage);
  // router.get('/api/getHomeRotation', jwt, controller.common.queryHomeRotation);
  // router.get('/api/getRotationDateils', jwt, controller.common.getRotationDateils);
  // router.post('/api/changeRotationStatus', jwt, controller.common.changeRotationStatus);
  // router.post('/api/updateRotationDateils', jwt, controller.common.updateRotationDateils);
};

