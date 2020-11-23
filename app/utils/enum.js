// 状态码
const RETURN_CODE = {
    200: '成功',
    401: 'token过期',
    400: '请求未传token',
    500: '服务器错误',
    404: 'api不存在',
    1000: '参数有误',
}

module.exports = {
    RETURN_CODE,
}