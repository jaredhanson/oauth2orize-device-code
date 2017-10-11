exports.middleware = {};
exports.middleware.request = require('./middleware/request');

exports.grant = {};
exports.grant.activate = require('./grant/activate');

exports.exchange = {};
exports.exchange.deviceCode = require('./exchange/deviceCode');

exports.TokenError = require('./errors/tokenerror');
