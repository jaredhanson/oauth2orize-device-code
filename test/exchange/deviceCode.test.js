var chai = require('chai')
  , authorizationCode = require('../../lib/exchange/deviceCode');


describe('exchange.deviceCode', function() {
  
  it('should be named device_code', function() {
    expect(authorizationCode(function(){}).name).to.equal('device_code');
  });
  
  describe('issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'pxDoJ3Bt9WVMTXfDATLkxJ9u') { return done(new Error('incorrect code argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA');
      }
      
      chai.connect.use(authorizationCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'pxDoJ3Bt9WVMTXfDATLkxJ9u' };
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
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"2YotnFZFEjr1zCsicMWpAA","token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token and refresh token', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'pxDoJ3Bt9WVMTXfDATLkxJ9u') { return done(new Error('incorrect code argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA', 'tGzv3JOkF0XG5Qx2TlKWIA');
      }
      
      chai.connect.use(authorizationCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'pxDoJ3Bt9WVMTXfDATLkxJ9u' };
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
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"2YotnFZFEjr1zCsicMWpAA","refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA","token_type":"Bearer"}');
    });
  });
  
})

