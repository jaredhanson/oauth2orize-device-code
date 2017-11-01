var chai = require('chai')
  , deviceCode = require('../../lib/grant/deviceCode')
  , AuthorizationError = require('../../lib/errors/authorizationerror');

describe('grant.device_code', function() {
  
  describe('module', function() {
    var mod = deviceCode(function(){});
    
    it('should be named device_code', function() {
      expect(mod.name).to.equal('device_code');
    });
    
    it('should expose request and response functions', function() {
      expect(mod.request).to.be.undefined;
      expect(mod.response).to.be.a('function');
    });
  });
  
  it('should throw if constructed without an activate callback', function() {
    expect(function() {
      deviceCode();
    }).to.throw(TypeError, 'oauth2orize.device.activate grant requires an activate callback');
  });

  describe('decision handling', function() {
    
    describe('activating device code', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, done) {
          if (client.id !== '1') { return done(new Error('incorrect client argument')); }
          if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect deviceCode argument')); }
          if (user.id !== '501') { return done(new Error('incorrect user argument')); }
          
          return done(null);
        }
        
        function inform(txn, res, params) {
          res.end('User ' + txn.user.name + ' has authorized client ' + txn.client.name + '.');
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: '1', name: 'OAuth Client' };
            txn.req = {
              scope: [ 'profile', 'tv' ]
            };
            txn.deviceCode = 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8';
            txn.user = { id: '501', name: 'John Doe' };
            txn.res = { allow: true };
          })
          .res(function(res) {
            res.locals = {};
            res.render = function(view) {
              this.view = view;
              this.end();
            }
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });
      
      it('should render', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.view).to.equal('oauth2/device/allowed');
        expect(response.locals.user).to.deep.equal({ id: '501', name: 'John Doe' });
        expect(response.locals.client).to.deep.equal({ id: '1', name: 'OAuth Client' });
      });
    }); // activating device code

    describe('transaction when passed to activate callback', function() {
      var response;
      
      before(function(done) {
        function activate(deviceCode, txn, done) {
          if (txn.client.id !== 'c123') { return done(new Error('incorrect txn argument')); }
          if (txn.user.id !== 'u123') { return done(new Error('incorrect txn argument')); }
          if (deviceCode !== 'dc123') { return done(new Error('incorrect deviceCode argument')); }
          
          return done(null);
        }
        
        function inform(txn, res, params) {
          res.end('User ' + txn.user.name + ' has authorized client ' + txn.client.name + '.');
        }
        
        chai.oauth2orize.grant(deviceCode({ inform: inform }, activate))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.req = {
              clientID:   'c123',
              deviceCode: 'dc123'
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal('User Bob has authorized client Example.');
      });
    });

    describe('transaction with complete callback', function() {
      var response, completed;
      
      before(function(done) {
        function activate(deviceCode, done) {
          if (deviceCode !== 'dc123') { return done(new Error('incorrect deviceCode argument')); }
          
          return done(null);
        }
        
        function inform(txn, res, params) {
          res.end('User ' + txn.user.name + ' has authorized client ' + txn.client.name + '.');
        }
        
        chai.oauth2orize.grant(deviceCode({ inform: inform }, activate))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.req = {
              clientID:   'c123',
              deviceCode: 'dc123'
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide(function(cb) {
            completed = true;
            process.nextTick(function() { cb() });
          });
      });

      it('should call complete callback', function() {
        expect(completed).to.be.true;
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal('User Bob has authorized client Example.');
      });
    });

    describe('transaction without inform callback', function() {
      var passed;
      
      before(function(done) {
        function activate(deviceCode, done) {
          if (deviceCode !== 'dc123') { return done(new Error('incorrect deviceCode argument')); }
          
          return done(null);
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.req = {
              clientID:   'c123',
              deviceCode: 'dc123'
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(req, res, next) {
            passed = true;
            done();
          })
          .decide();
      });
      
      it('should pass back up to the middleware processing', function() {
        expect(passed).to.equal(true);
      });
    });
    
    describe('encountering an error while activating device code', function() {
      var err;
      
      before(function(done) {
        function activate(deviceCode, done) {
          return done(new Error('something went wrong'));
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: 'cERROR', name: 'Example' };
            txn.req = {
              clientID:   'c123',
              deviceCode: 'dc123'
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(e) {
            err = e;
            done();
          })
          .decide();
      });
      
      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('something went wrong');
      });
    });

    describe('throwing an error while activating device code', function() {
      var err;
      
      before(function(done) {
        function activate(deviceCode, done) {
          throw new Error('something was thrown');
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: 'cTHROW', name: 'Example' };
            txn.req = {
              clientID:   'c123',
              deviceCode: 'dc123'
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(e) {
            err = e;
            done();
          })
          .decide();
      });
      
      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('something was thrown');
      });
    });
  });

  describe('error handling', function() {
    
    describe('error on transaction', function() {
      var response;
      
      before(function(done) {
        function activate(deviceCode, done) {}
        
        function inform(txn, res, params) {
          res.end('code: ' + params.error + ', message: ' + params.error_description);
        }
        
        chai.oauth2orize.grant(deviceCode({ inform: inform }, activate))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.req = {
              clientID:   'c123',
              deviceCode: 'dc123'
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .error(new Error('something went wrong'));
      });
      
      it('should respond', function() {
        expect(response.body).to.equal('code: server_error, message: something went wrong');
      });
    });

    describe('error on transaction without inform callback', function() {
      var passed;
      
      before(function(done) {
        function activate(deviceCode, done) {}
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.req = {
              clientID:   'c123',
              deviceCode: 'dc123'
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(err, req, res, next) {
            passed = true;
            done();
          })
          .error(new Error('something went wrong'));
      });
      
      it('should pass back up to the middleware processing', function() {
        expect(passed).to.equal(true);
      });
    });
  });
});
