/* global describe, it */

var pkg = require('..');
var expect = require('chai').expect;


describe('oauth2orize-device-code', function() {
  
  it('should export grants', function() {
    expect(pkg.grant).to.be.an('object');
    expect(pkg.grant.deviceCode).to.be.a('function');
  });
  
  it('should export exchanges', function() {
    expect(pkg.exchange).to.be.an('object');
    expect(pkg.exchange.deviceCode).to.be.a('function');
  });
  
  it('should export middleware', function() {
    expect(pkg.middleware).to.be.an('object');
    expect(pkg.middleware.authorization).to.be.a('function');
  });
  
});
