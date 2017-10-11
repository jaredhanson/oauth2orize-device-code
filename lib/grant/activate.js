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
  
  var userCodeProperty   = options.userCodeProperty   || 'userCode';
  var deviceCodeProperty = options.deviceCodeProperty || 'deviceCode';
  
  var inform = options.inform || function (txn, res, params, next) { return next(); }
  
  /* Parse authorization request implicit in device activation
   *
   * @param {http.ServerRequest} req
   * @api public
   */
  function request(req) {
    var userCode = req[userCodeProperty];
    var clientID = userCode.clientID;
      , scope = userCode.scope
      , deviceCode = userCode[deviceCodeProperty];
     
    if (!clientID) { throw new AuthorizationError('Missing required parameter: client_id', 'invalid_request'); }
    if (typeof clientID !== 'string') { throw new AuthorizationError('Invalid parameter: client_id must be a string', 'invalid_request'); }
    
    if (!deviceCode) { throw new AuthorizationError('Missing required information: deviceCode', 'invalid_request'); }
    
    if (scope) {
      if (typeof scope !== 'string') {
        throw new AuthorizationError('Invalid parameter: scope must be a string', 'invalid_request');
      }

      for (var i = 0, len = separators.length; i < len; i++) {
        var separated = scope.split(separators[i]);
        // only separate on the first matching separator.  this allows for a sort
        // of separator "priority" (ie, favor spaces then fallback to commas)
        if (separated.length > 1) {
          scope = separated;
          break;
        }
      }
      
      if (!Array.isArray(scope)) { scope = [ scope ]; }
    }
    
    return {
      clientID: clientID,
      scope: scope,
      deviceCode: deviceCode
    };
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
    
    if (!txn.res.allow) {
      var params = { error: 'access_denied' };
      return inform(txn, res, params, next);
    }
    
    function activated(err) {
      if (err) { return next(err); }
      
      var params = {};
      complete(function(err) {
        if (err) { return next(err); }
        return inform(txn, res, params, next);
      });
    }
    
    try {
      activate(txn.req.deviceCode, activated);
    } catch (ex) {
      return next(ex);
    }
  }
  
  function errorHandler(err, txn, res, next) {
    var params = {};
    
    params.error = err.code || 'server_error';
    if (err.message) { params.error_description = err.message; }
    if (err.uri) { params.error_uri = err.uri; }
    
    return inform(txn, res, params, next);
  }
  
  /**
   * Return `user code` activation module.
   */
  var mod = {};
  mod.name = 'activate';
  mod.request = request;
  mod.response = response;
  mod.error = errorHandler;
  return mod;
}
