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
  
  describe('not issuing a device code', function() {
    var response, err;

    before(function(done) {
      function issue(client, done) {
        return done(null, false);
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
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('AuthorizationError');
      expect(err.message).to.equal('Request denied by authorization server');
      expect(err.code).to.equal('access_denied');
      expect(err.status).to.equal(403);
    });
  });
  
  describe('encountering an error while issuing a device code', function() {
    var response, err;

    before(function(done) {
      function issue(client, done) {
        return done(new Error('something is wrong'));
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
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('something is wrong');
    });
  });
  
  describe('encountering an exception while issuing a device code', function() {
    var response, err;

    before(function(done) {
      function issue(client, done) {
        throw new Error('something is horribly wrong')
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
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('something is horribly wrong');
    });
  });
  
  describe('handling a request without a body', function() {
    var response, err;

    before(function(done) {
      function issue(client, done) {
        return done(null, 'IGNORE', 'IGNORE');
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('OAuth2orize requires body parsing. Did you forget to use body-parser middleware?');
    });
  });
  
  describe('handling a request where scope format is not string', function() {
    var response, err;

    before(function(done) {
      function issue(client, done) {
        return done(null, 'IGNORE', 'IGNORE');
      }
      
      chai.connect.use(deviceAuthorization({ verificationURI: 'http://www.example.com/device'}, issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { scope: ['read', 'write'] };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.name).to.equal('AuthorizationError');
      expect(err.message).to.equal('Invalid parameter: scope must be a string');
      expect(err.code).to.equal('invalid_request');
      expect(err.status).to.equal(400);
    });
  });
  
  describe('with scope separator option', function() {
    
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
      
        chai.connect.use(deviceAuthorization({ scopeSeparator: ',', verificationURI: 'http://www.example.com/device'}, issue))
          .req(function(req) {
            req.user = { id: '459691054427', name: 'Example' };
            req.body = { scope: 'profile,tv' };
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
    
  }); // with scope separator option
  
  describe('with multiple scope separator option', function() {
    
    describe('issuing a device code based on array of scopes separated by space', function() {
      var response, err;

      before(function(done) {
        function issue(client, scope, done) {
          if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
          if (scope.length !== 2) { return done(new Error('incorrect scope argument')); }
          if (scope[0] !== 'profile') { return done(new Error('incorrect scope argument')); }
          if (scope[1] !== 'tv') { return done(new Error('incorrect scope argument')); }
          return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT');
        }
      
        chai.connect.use(deviceAuthorization({ scopeSeparator: [' ', ','], verificationURI: 'http://www.example.com/device'}, issue))
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
    
    describe('issuing a device code based on array of scopes separated by comma', function() {
      var response, err;

      before(function(done) {
        function issue(client, scope, done) {
          if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
          if (scope.length !== 2) { return done(new Error('incorrect scope argument')); }
          if (scope[0] !== 'profile') { return done(new Error('incorrect scope argument')); }
          if (scope[1] !== 'tv') { return done(new Error('incorrect scope argument')); }
          return done(null, 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', 'WDJB-MJHT');
        }
      
        chai.connect.use(deviceAuthorization({ scopeSeparator: [' ', ','], verificationURI: 'http://www.example.com/device'}, issue))
          .req(function(req) {
            req.user = { id: '459691054427', name: 'Example' };
            req.body = { scope: 'profile,tv' };
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
    
  }); // with multiple scope separator option
  
  describe('with user property option', function() {
    
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
      
        chai.connect.use(deviceAuthorization({ userProperty: 'client', verificationURI: 'http://www.example.com/device'}, issue))
          .req(function(req) {
            req.client = { id: '459691054427', name: 'Example' };
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
    
  }); // with user property option
  
});
