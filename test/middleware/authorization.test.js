var chai = require('chai')
  , deviceAuthorization = require('../../lib/middleware/authorization');


describe('middleware.request', function() {
  
  it('should be named deviceAuthorization', function() {
    expect(deviceAuthorization(function(){}).name).to.equal('deviceAuthorization');
  });
  
  it('should throw if constructed without an issue callback', function() {
    expect(function() {
      deviceAuthorization();
    }).to.throw(TypeError, 'deviceAuthorization middleware requires an issue function');
  });
  
  describe('issuing a device code', function() {
    var response, err;

    before(function(done) {
      function issue(client, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT');
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = {};
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
      expect(response.body).to.equal('{"device_code":"GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8","user_code":"WDJB-MJHT","verification_uri":"http://www.example.com/device"}');
    });
  });
  
  describe('issuing a device code with interval', function() {
    var response, err;

    before(function(done) {
      function issue(client, scope, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT', { interval: 5 });
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = {};
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
      expect(response.body).to.equal('{"device_code":"GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8","user_code":"WDJB-MJHT","verification_uri":"http://www.example.com/device","interval":5}');
    });
  });
  
  describe('issuing a device code based on scope', function() {
    var response, err;

    before(function(done) {
      function issue(client, scope, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (scope.length !== 1) { return done(new Error('incorrect scope argument')); }
        if (scope[0] !== 'tv') { return done(new Error('incorrect scope argument')); }
        return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT');
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { scope: 'tv' };
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
      expect(response.body).to.equal('{"device_code":"GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8","user_code":"WDJB-MJHT","verification_uri":"http://www.example.com/device"}');
    });
  });
  
  describe('issuing a device code based on array of scopes', function() {
    var response, err;

    before(function(done) {
      function issue(client, scope, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (scope.length !== 2) { return done(new Error('incorrect scope argument')); }
        if (scope[0] !== 'profile') { return done(new Error('incorrect scope argument')); }
        if (scope[1] !== 'tv') { return done(new Error('incorrect scope argument')); }
        return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT');
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { scope: 'profile tv' };
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
      expect(response.body).to.equal('{"device_code":"GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8","user_code":"WDJB-MJHT","verification_uri":"http://www.example.com/device"}');
    });
  });
  
  describe('issuing a device code based on scope and body', function() {
    var response, err;

    before(function(done) {
      function issue(client, scope, body, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (scope.length !== 1) { return done(new Error('incorrect scope argument')); }
        if (scope[0] !== 'tv') { return done(new Error('incorrect scope argument')); }
        if (body.audience !== 'https://api.example.com/') { return done(new Error('incorrect body argument')); }
        return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT');
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { scope: 'tv', audience: 'https://api.example.com/' };
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
      expect(response.body).to.equal('{"device_code":"GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8","user_code":"WDJB-MJHT","verification_uri":"http://www.example.com/device"}');
    });
  });
  
  describe('issuing a device code based on scope, body, and authInfo', function() {
    var response, err;

    before(function(done) {
      function issue(client, scope, body, authInfo, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (scope.length !== 1) { return done(new Error('incorrect scope argument')); }
        if (scope[0] !== 'tv') { return done(new Error('incorrect scope argument')); }
        if (body.audience !== 'https://api.example.com/') { return done(new Error('incorrect body argument')); }
        if (authInfo.ip !== '127.0.0.1') { return done(new Error('incorrect authInfo argument')); }
        return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT');
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { scope: 'tv', audience: 'https://api.example.com/' };
          req.authInfo = { ip: '127.0.0.1' };
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
      expect(response.body).to.equal('{"device_code":"GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8","user_code":"WDJB-MJHT","verification_uri":"http://www.example.com/device"}');
    });
  });
  
});
