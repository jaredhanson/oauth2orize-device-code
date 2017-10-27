/**
 * Loads an OAuth 2.0 device code authorization transaction.
 *
 * This middleware is used to load a pending OAuth 2.0 device code transaction
 * serialized after a request to the device code grant endpoint.
 *
 * Options:
 *
 *     scopeSeparator  if scope is stored as string, indicates the character separating the individual scopes
 *     txnProperty     key under which transaction information is stored on the req object
 *     extendTxn       optional callback function to allow extending the transaction object
 *
 * @param {Server} server
 * @param {Object} options
 * @return {Function}
 * @api protected
 */

// TODO: With the change to oauth2orize, in which loadTransaction is expected to
//       directly process the user_code and setup `req.oauth2`, this middleware can
//       be removed from this package, since its implementation will be application specofic

module.exports = function (server, options) {
  options = options || {};
  
  if (!server) { throw new TypeError('oauth2orize.transactionLoader middleware requires a server argument'); }
  
  var separators = options.scopeSeparator || ' ';
  if (!Array.isArray(separators)) {
    separators = [ separators ];
  }
  
  var txnProperty = options.txnProperty || 'txn';
  
  return function transactionLoader(req, res, next) {
    if (req.oauth2) { return next(); }
    
    var txn = req[txnProperty];
    if (typeof txn !== 'object') { return next(new Error('Invalid transaction configuration')); }
    
    req.oauth2 = {};
    req.oauth2.client = txn.client;
    req.oauth2.user = txn.user || req.user;
    
    var scope = txn.scope;
    if (scope && typeof scope === 'string') {
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
    
    req.oauth2.req = {};
    req.oauth2.req.type = 'activate';
    req.oauth2.req.scope = scope;
    
    var params = Object.keys(txn);
    for (param in params) {
      if ([ 'client', 'user', 'scope' ].indexOf(param) === -1) { continue; }
      req.oauth2.req[param] = txn[param];
    }
    
    if (res.locals) {
      req.oauth2.locals = res.locals;
    }
    
    if (options.extendTxn && typeof options.extendTxn === 'function') {
      
      function post(err, mod) {
        if (err) { return next(err); }
        if (mod) { req.oauth2 = mod; }

        return next();
      }
      
      return options.extendTxn(req.oauth2, post);
    }
    
    return next();
  };
};
