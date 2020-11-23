'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/common')(app);
  require('./router/member')(app);
  require('./router/order')(app);
  require('./router/product')(app);
};
