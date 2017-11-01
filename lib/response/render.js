exports = module.exports = function(allowedView, errorView) {
  allowedView = allowedView || 'oauth2/device/allowed';
  deniedView = 'oauth2/device/denied';
  errorView = errorView || 'oauth2/device/error';
  
  var respond = function(txn, res, params) {
    res.locals.user = txn.user;
    res.locals.client = txn.client;
    
    if (params.error) {
      if (params.error == 'access_denied') {
        res.render(deniedView);
      } else {
        res.render(errorView);
      }
    } else {
      res.render(allowedView);
    }
  }
  
  respond.validate = function(txn) {
  };

  return respond;
}
