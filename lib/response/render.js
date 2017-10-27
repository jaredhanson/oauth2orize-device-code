exports = module.exports = function(allowedView, errorView) {
  allowedView = allowedView || 'oauth2/device/allowed';
  errorView = allowedView || 'oauth2/device/error';
  
  var respond = function(txn, res, params) {
    res.locals.user = txn.user;
    res.locals.client = txn.client;
    
    if (params.error) {
      res.render(errorView);
    } else {
      res.render(allowedView);
    }
  }
  
  respond.validate = function(txn) {
    console.log('TODO: validate for response');
    //if (!txn.redirectURI) { throw new AuthorizationError('Unable to issue redirect for OAuth 2.0 transaction', 'server_error'); }
  };

  return respond;
}
