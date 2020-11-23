'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  // const jwt = middleware.tokenHandler(app.config.jwt);
  // router.get('/order/getOrderList', jwt, controller.order.queryOrderListByAdminId);
  // router.get('/order/getOrderInfo/:id', jwt, controller.order.queryOrderInfoByOrderId);
};

