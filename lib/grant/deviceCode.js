/**
 * Module dependencies.
 */
var AuthorizationError = require('../errors/authorizationerror');

/**
 * Handles requests for the user to authorize a grant by activating a requested device code.
 *
 * @param {Object} options
 * @param {Function} activate
 * @return {Object} module
 * @api public
 */
module.exports = function activation(options, activate) {
  if (typeof options == 'function') {
    activate = options;
    options = undefined;
  }
  options = options || {};
  
  if (!activate) { throw new TypeError('oauth2orize.device.activate grant requires an activate callback'); }
  
  var modes = options.modes || {};
  if (!modes.default) {
    modes.default = require('../response/render')();
  }
  
  /* Activates the device code upon consent of user.
   *
   * @param {Object} txn
   * @param {http.ServerResponse} res
   * @param {Function} complete
   * @param {Function} next
   * @api public
   */
  function response(txn, res, complete, next) {
    var mode = 'default'
      , respond;
    if (txn.req && txn.req.responseMode) {
      mode = txn.req.responseMode;
    }
    respond = modes[mode];
    
    if (!respond) {
      // http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20140317/004680.html
      return next(new AuthorizationError('Unsupported device response mode: ' + mode, 'unsupported_response_mode', null, 501));
    }
    if (respond && respond.validate) {
      try {
        respond.validate(txn);
      } catch(ex) {
        return next(ex);
      }
    }
    
    if (!txn.res.allow) {
      var params = { error: 'access_denied' };
      return respond(txn, res, params);
    }
    
    function activated(err) {
      if (err) { return next(err); }
      
      var params = {};
      complete(function(err) {
        if (err) { return next(err); }
        return respond(txn, res, params);
      });
    }

    try {
      var arity = activate.length;
      if (arity == 7) {
        activate(txn.client, txn.locals.deviceCode, txn.user, txn.res, txn.req, txn.locals, activated);
      } else if (arity == 6) {
        activate(txn.client, txn.locals.deviceCode, txn.user, txn.res, txn.req, activated);
      } else if (arity == 5) {
        activate(txn.client, txn.locals.deviceCode, txn.user, txn.res, activated);
      } else { // arity == 4
        activate(txn.client, txn.locals.deviceCode, txn.user, activated);
      }
    } catch (ex) {
      return next(ex);
    }
  }
  
  function errorHandler(err, txn, res, next) {
    var mode = 'default'
      , params = {}
      , respond;
    if (txn.req && txn.req.responseMode) {
      mode = txn.req.responseMode;
    }
    respond = modes[mode];
  
    if (!respond) {
      return next(err);
    }
    if (respond && respond.validate) {
      try {
        respond.validate(txn);
      } catch(ex) {
        return next(err);
      }
    }
    
    params.error = err.code || 'server_error';
    if (err.message) { params.error_description = err.message; }
    if (err.uri) { params.error_uri = err.uri; }
    return respond(txn, res, params);
  }
  
  /**
   * Return `user code` activation module.
   */
  var mod = {};
  // TODO: rename file to deviceCode.js
  mod.name = 'device_code';
  mod.response = response;
  mod.error = errorHandler;
  return mod;
}
