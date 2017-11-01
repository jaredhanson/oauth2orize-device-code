var chai = require('chai')
  , deviceCode = require('../../lib/exchange/deviceCode');


describe.only('exchange.device_code', function() {
  
  it('should be named device_code', function() {
    expect(deviceCode(function(){}).name).to.equal('device_code');
  });
  
  it('should throw if constructed without a issue callback', function() {
    expect(function() {
      deviceCode();
    }).to.throw(TypeError, 'oauth2orize.device_code exchange requires an issue callback');
  });
  
  describe('issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA');
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
        })
        .end(function(res) {
          response = res;
          done();
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
  }); // issuing an access token
  
  describe('issuing an access token and refresh token', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA', 'tGzv3JOkF0XG5Qx2TlKWIA');
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
        })
        .end(function(res) {
          response = res;
          done();
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
  }); // issuing an access token and refresh token
  
  describe('issuing an access token and params', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA', { 'expires_in': 3600 });
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"2YotnFZFEjr1zCsicMWpAA","expires_in":3600,"token_type":"Bearer"}');
    });
  }); // issuing an access token and params
  
  describe('issuing an access token, null refresh token, and params', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA', null, { 'expires_in': 3600 });
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"2YotnFZFEjr1zCsicMWpAA","expires_in":3600,"token_type":"Bearer"}');
    });
  }); // issuing an access token, null refresh token, and params
  
  describe('issuing an access token, null refresh token, and params with token type', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA', 'tGzv3JOkF0XG5Qx2TlKWIA', { 'token_type': 'example', 'expires_in': 3600 });
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"2YotnFZFEjr1zCsicMWpAA","refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA","token_type":"example","expires_in":3600}');
    });
  }); // issuing an access token, null refresh token, and params with token type
  
  describe('issuing an access token based on body', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, body, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
        if (body.foo !== 'bar') { return done(new Error('incorrect body argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA');
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', foo: 'bar' };
        })
        .end(function(res) {
          response = res;
          done();
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
  }); // issuing an access token based on body
  
  describe('issuing an access token based on body and authInfo', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, body, authInfo, done) {
        if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
        if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
        if (body.foo !== 'bar') { return done(new Error('incorrect body argument')); }
        if (authInfo.ip !== '127.0.0.1') { return done(new Error('incorrect authInfo argument')); }
        return done(null, '2YotnFZFEjr1zCsicMWpAA');
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8', foo: 'bar' };
          req.authInfo = { ip: '127.0.0.1' };
        })
        .end(function(res) {
          response = res;
          done();
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
  }); // issuing an access token based on body and authInfo
  
  describe('not issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        return done(null, false);
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('TokenError');
      expect(err.message).to.equal('Invalid device code');
      expect(err.code).to.equal('invalid_grant');
      expect(err.status).to.equal(403);
    });
  }); // not issuing an access token
  
  describe('handling a request in which body has not been parsed', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        return done(null, 'IGNORE');
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
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
  }); // handling a request in which body has not been parsed
  
  describe('handling a request without device code parameter', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        return done(null, 'IGNORE');
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = {};
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('TokenError');
      expect(err.message).to.equal('Missing required parameter: device_code');
      expect(err.code).to.equal('invalid_request');
      expect(err.status).to.equal(400);
    });
  }); // handling a request without device code parameter
  
  describe('encountering an error while issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        return done(new Error('something is wrong'));
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
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
  }); // encountering an error while issuing an access token
  
  describe('encountering an exception while issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, deviceCode, done) {
        throw new Error('something is horribly wrong');
      }
      
      chai.connect.use(deviceCode(issue))
        .req(function(req) {
          req.user = { id: '459691054427', name: 'Example' };
          req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
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
  }); // encountering an exception while issuing an access token
  
  describe('options', function() {
    
    describe('userProperty', function() {
      
      describe('issuing an access token', function() {
        var response, err;

        before(function(done) {
          function issue(client, deviceCode, done) {
            if (client.id !== '459691054427') { return done(new Error('incorrect client argument')); }
            if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect code argument')); }
            return done(null, '2YotnFZFEjr1zCsicMWpAA');
          }
      
          chai.connect.use(deviceCode({ userProperty: 'client' }, issue))
            .req(function(req) {
              req.client = { id: '459691054427', name: 'Example' };
              req.body = { device_code: 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8' };
            })
            .end(function(res) {
              response = res;
              done();
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
      }); // issuing an access token
      
    }); // userProperty
    
  }); // options
  
})

