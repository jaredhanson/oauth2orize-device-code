var merge = require('utils-merge'),
    TokenError = require('../errors/tokenerror');

module.exports = function(options, issue) {
  if (typeof options == 'function') {
    issue = options;
    options = undefined;
  }
  options = options || {};
  
  var userProperty = options.userProperty || 'user';
  
  
  return function device_code(req, res, next) {
    if (!req.body) { return next(new Error('OAuth2orize requires body parsing. Did you forget to use body-parser middleware?')); }
    
    // The 'user' property of `req` holds the authenticated user.  In the case
    // of the token endpoint, the property will contain the OAuth 2.0 client.
    var client = req[userProperty]
      , deviceCode = req.body.device_code;
    
    if (!deviceCode) { return next(new TokenError('Missing required parameter: device_code', 'invalid_request')); }
  
    function issued(err, accessToken, refreshToken, params) {
      if (err) { return next(err); }
      if (!accessToken) { return next(new TokenError('Invalid device code', 'invalid_grant')); }
      if (refreshToken && typeof refreshToken == 'object') {
        params = refreshToken;
        refreshToken = null;
      }

      var tok = {};
      tok.access_token = accessToken;
      if (refreshToken) { tok.refresh_token = refreshToken; }
      if (params) { merge(tok, params); }
      tok.token_type = tok.token_type || 'Bearer';

      var json = JSON.stringify(tok);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Pragma', 'no-cache');
      res.end(json);
    }
    
    try {
      var arity = issue.length;
      if (arity == 5) {
        issue(client, deviceCode, req.body, req.authInfo, issued);
      } else if (arity == 4) {
        issue(client, deviceCode, req.body, issued);
      } else { // arity == 3
        issue(client, deviceCode, issued);
      }
    } catch (ex) {
      return next(ex);
    }
  }
}
