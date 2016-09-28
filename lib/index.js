exports.middleware = {};
exports.middleware.request = require('./middleware/request');

exports.exchange = {};
exports.exchange.deviceCode = require('./exchange/deviceCode');

exports.TokenError = require('./errors/tokenerror');
