exports.middleware = {};
exports.middleware.authorization = require('./middleware/authorization');

exports.grant = {};
exports.grant.deviceCode = require('./grant/deviceCode');

exports.exchange = {};
exports.exchange.deviceCode = require('./exchange/deviceCode');

exports.TokenError = require('./errors/tokenerror');
