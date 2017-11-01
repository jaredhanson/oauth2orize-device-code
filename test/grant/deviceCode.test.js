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

  describe('decision processing', function() {
    
    describe('activating device code', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, done) {
          if (client.id !== '1') { return done(new Error('incorrect client argument')); }
          if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect deviceCode argument')); }
          if (user.id !== '501') { return done(new Error('incorrect user argument')); }
          
          return done(null);
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

    describe('activating device code based on response', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, ares, done) {
          if (client.id !== '1') { return done(new Error('incorrect client argument')); }
          if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect deviceCode argument')); }
          if (user.id !== '501') { return done(new Error('incorrect user argument')); }
          if (ares.scope[0] !== 'tv') { return done(new Error('incorrect ares argument')); }
          
          return done(null);
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: '1', name: 'OAuth Client' };
            txn.req = {
              scope: [ 'profile', 'tv' ]
            };
            txn.deviceCode = 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8';
            txn.user = { id: '501', name: 'John Doe' };
            txn.res = { allow: true, scope: [ 'tv' ] };
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
    }); // activating device code based on response
    
    describe('activating device code based on response and request', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, ares, areq, done) {
          if (client.id !== '1') { return done(new Error('incorrect client argument')); }
          if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect deviceCode argument')); }
          if (user.id !== '501') { return done(new Error('incorrect user argument')); }
          if (ares.scope[0] !== 'tv') { return done(new Error('incorrect ares argument')); }
          if (areq.scope[0] !== 'profile') { return done(new Error('incorrect areq argument')); }
          
          return done(null);
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: '1', name: 'OAuth Client' };
            txn.req = {
              scope: [ 'profile', 'tv' ]
            };
            txn.deviceCode = 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8';
            txn.user = { id: '501', name: 'John Doe' };
            txn.res = { allow: true, scope: [ 'tv' ] };
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
    }); // activating device code based on response and request
    
    describe('activating device code based on response, request, and locals', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, ares, areq, locals, done) {
          if (client.id !== '1') { return done(new Error('incorrect client argument')); }
          if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect deviceCode argument')); }
          if (user.id !== '501') { return done(new Error('incorrect user argument')); }
          if (ares.scope[0] !== 'tv') { return done(new Error('incorrect ares argument')); }
          if (areq.scope[0] !== 'profile') { return done(new Error('incorrect areq argument')); }
          if (locals.bar !== 'baz') { return done(new Error('incorrect locals argument')); }
          
          return done(null);
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: '1', name: 'OAuth Client' };
            txn.req = {
              scope: [ 'profile', 'tv' ]
            };
            txn.deviceCode = 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8';
            txn.user = { id: '501', name: 'John Doe' };
            txn.res = { allow: true, scope: [ 'tv' ] };
            txn.locals = { bar: 'baz' };
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
    }); // activating device code based on response, request, and locals

    describe('activating device code with complete callback', function() {
      var response, completed;
      
      before(function(done) {
        function activate(client, deviceCode, user, done) {
          if (client.id !== '1') { return done(new Error('incorrect client argument')); }
          if (deviceCode !== 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8') { return done(new Error('incorrect deviceCode argument')); }
          if (user.id !== '501') { return done(new Error('incorrect user argument')); }
          
          return done(null);
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
          .decide(function(cb) {
            completed = true;
            process.nextTick(function() { cb() });
          });
      });
      
      it('should call complete callback', function() {
        expect(completed).to.be.true;
      });
      
      it('should render', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.view).to.equal('oauth2/device/allowed');
        expect(response.locals.user).to.deep.equal({ id: '501', name: 'John Doe' });
        expect(response.locals.client).to.deep.equal({ id: '1', name: 'OAuth Client' });
      });
    }); // activating device code with complete callback
    
    describe('authorization denied by user', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, done) {
          return done(null);
        }
        
        chai.oauth2orize.grant(deviceCode(activate))
          .txn(function(txn) {
            txn.client = { id: '1', name: 'OAuth Client' };
            txn.req = {
              scope: [ 'profile', 'tv' ]
            };
            txn.deviceCode = 'GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8';
            txn.user = { id: '501', name: 'John Doe' };
            txn.res = { allow: false };
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
        expect(response.view).to.equal('oauth2/device/denied');
        expect(response.locals.user).to.deep.equal({ id: '501', name: 'John Doe' });
        expect(response.locals.client).to.deep.equal({ id: '1', name: 'OAuth Client' });
      });
    }); // authorization denied by user
    
    describe('encountering an error while activating device code', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, done) {
          return done(new Error('something went wrong'));
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
    }); // encountering an error while activating device code

    describe('encountering an exception while issuing cross domain code', function() {
      var err;
      
      before(function(done) {
        function activate(deviceCode, done) {
          throw new Error('something went horribly wrong');
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
        expect(err.message).to.equal('something went horribly wrong');
      });
    }); // encountering an exception while issuing cross domain code
  
    describe('encountering an error while completing transaction', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, done) {
          return done(null);
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
          .next(function(e) {
            err = e;
            done();
          })
          .decide(function(cb) {
            process.nextTick(function() { cb(new Error('failed to complete transaction')) });
          });
      });
      
      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('failed to complete transaction');
      });
    }); // encountering an error while completing transaction
  
  }); // decision processing

  describe('error handling', function() {
    
    describe('generic error', function() {
      var response;
      
      before(function(done) {
        function activate(client, deviceCode, user, done) {
          return done(null);
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
          .error(new Error('something went wrong'));
      });
      
      it('should render', function() {
        expect(response.statusCode).to.equal(200);
        expect(response.view).to.equal('oauth2/device/error');
        expect(response.locals.user).to.deep.equal({ id: '501', name: 'John Doe' });
        expect(response.locals.client).to.deep.equal({ id: '1', name: 'OAuth Client' });
      });
    }); // generic error
    
  }); // error handling

});
