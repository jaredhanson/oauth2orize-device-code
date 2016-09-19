var chai = require('chai')
  , authorizationCode = require('../../lib/exchange/deviceCode');


describe('exchange.deviceCode', function() {
  
  it('should be named device_code', function() {
    expect(authorizationCode(function(){}).name).to.equal('device_code');
  });
  
})

