'use strict';

const { cb } = require('../utils');
module.exports = () => {
    return async function (ctx, next) {
        try {
            await next();
        } catch (err) {
            ctx.app.emit('error', err, ctx);
            const status = err.status || 500;
            const error = status === 500 && ctx.app.config.env === 'prod' ? '服务器异常' : err.message;
            switch (status) {
                case 401:
                    ctx.body = cb({ msg: 'token error', code: 401 });
                    break;
                case 422:
                    ctx.body = cb({ msg: '语义错误', data: error, code: 500 });
                    break;
                default:
                    ctx.body = cb({ code: 500, msg: '服务器错误', data: error });
            }
        }
    }
}
