'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.tokenHandler(app.config.jwt);
  router.get('/product/queryCategoryByAdminId', controller.product.queryCategoryByAdminId);
  router.get('/product/queryProductInfoById', controller.product.queryProductInfoById);
  // router.post('/product/createOrUpdateProduct', jwt, controller.product.updateOrInsertProduct);
  // router.post('/product/changeProductStatus', jwt, controller.product.changeProductStatus);
  
  
  // router.get('/product/getCategoryList', jwt, controller.product.queryCategoryByAdminId);
  // router.post('/product/changeCategoryStatus', jwt, controller.product.changeCategoryStatus);
  // router.post('/product/createOrUpdateCategory', jwt, controller.product.updateOrInsertCategory);
};

