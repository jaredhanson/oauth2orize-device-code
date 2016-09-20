var chai = require('chai')
  , deviceAuthorizationRequest = require('../../lib/middleware/request');


describe('middleware.request', function() {
  
  it('should be named device_authorization_request', function() {
    expect(deviceAuthorizationRequest(function(){}).name).to.equal('device_authorization_request');
  });
  
  describe('issuing a device code', function() {
    var response, err;

    before(function(done) {
      function issue(client, scope, done) {
        if (client.id !== 's6BhdRkqt3') { return done(new Error('incorrect client argument')); }
        if (scope !== undefined) { return done(new Error('incorrect code argument')); }
        return done(null, '74tq5miHKB', '94248', 'http://www.example.com/device');
      }
      
      chai.connect.use(deviceAuthorizationRequest(issue))
        .req(function(req) {
          req.user = { id: 's6BhdRkqt3', name: 'Example' };
          req.body = { response_type: 'device_code' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .next(function(err) {
          console.log(err);
          console.log(err.stack);
          throw err;
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"device_code":"74tq5miHKB","user_code":"94248","verification_uri":"http://www.example.com/device"}');
    });
  });
  
  describe('issuing a device code with interval', function() {
    var response, err;

    before(function(done) {
      function issue(client, scope, done) {
        if (client.id !== 's6BhdRkqt3') { return done(new Error('incorrect client argument')); }
        if (scope !== undefined) { return done(new Error('incorrect code argument')); }
        return done(null, '74tq5miHKB', '94248', 'http://www.example.com/device', { interval: 5 });
      }
      
      chai.connect.use(deviceAuthorizationRequest(issue))
        .req(function(req) {
          req.user = { id: 's6BhdRkqt3', name: 'Example' };
          req.body = { response_type: 'device_code' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .next(function(err) {
          console.log(err);
          console.log(err.stack);
          throw err;
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"device_code":"74tq5miHKB","user_code":"94248","verification_uri":"http://www.example.com/device","interval":5}');
    });
  });
  
});
