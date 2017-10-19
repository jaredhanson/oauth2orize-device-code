var chai = require('chai')
  , activation = require('../../lib/grant/activate')
  , AuthorizationError = require('../../lib/errors/authorizationerror');

describe('grant.activate', function() {
  
  describe('module', function() {
    var mod = activation(function(){});
    
    it('should be named activate', function() {
      expect(mod.name).to.equal('activate');
    });
    
    it('should expose request and response functions', function() {
      expect(mod.request).to.be.a('function');
      expect(mod.response).to.be.a('function');
    });
  });
  
  it('should throw if constructed without an activate callback', function() {
    expect(function() {
      activation();
    }).to.throw(TypeError, 'oauth2orize.device.activate grant requires an activate callback');
  });

  describe('request parsing', function() {
    function issue(){}
    
    describe('request', function() {
      var err, out;
      
      before(function(done) {
        chai.oauth2orize.grant(activation(issue))
          .req(function(req) {
            req.user_code = {};
            req.user_code.client_id   = 'c123';
            req.user_code.scope       = [ 'read' ];
            req.user_code.device_code = 'dc123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });
      
      it('should not error', function() {
        expect(err).to.be.null;
      });
      
      it('should parse request', function() {
        expect(out.clientID).to.equal('c123');
        expect(out.scope).to.be.an('array');
        expect(out.scope).to.have.length(1);
        expect(out.scope[0]).to.equal('read');
        expect(out.deviceCode).to.equal('dc123');
      });
    });
     
    describe('request with missing client_id parameter', function() {
      var err, out;
      
      before(function(done) {
        chai.oauth2orize.grant(activation(issue))
          .req(function(req) {
            req.user_code = {};
            req.user_code.scope       = [ 'read' ];
            req.user_code.device_code = 'dc123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });
      
      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Missing required parameter: client_id');
        expect(err.code).to.equal('invalid_request');
      });
    });

    describe('request with invalid client_id parameter', function() {
      var err, out;
      
      before(function(done) {
        chai.oauth2orize.grant(activation(issue))
          .req(function(req) {
            req.user_code = {};
            req.user_code.client_id   = ['c123', 'c123'];
            req.user_code.scope       = [ 'read' ];
            req.user_code.device_code = 'dc123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });
      
      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Invalid parameter: client_id must be a string');
        expect(err.code).to.equal('invalid_request');
      });
    });
    
    describe('request with missing device_code parameter', function() {
      var err, out;
      
      before(function(done) {
        chai.oauth2orize.grant(activation(issue))
          .req(function(req) {
            req.user_code = {};
            req.user_code.client_id = 'c123';
            req.user_code.scope     = [ 'read' ];
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });
      
      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Missing required parameter: device_code');
        expect(err.code).to.equal('invalid_request');
      });
    });
  });

  describe('decision handling', function() {
    
    describe('transaction', function() {
      var response;
      
      before(function(done) {
        function activate(deviceCode, done) {
          if (deviceCode !== 'dc123') { return done(new Error('incorrect deviceCode argument')); }
          
          return done(null);
        }
        
        function inform(txn, res, params) {
          res.end('User ' + txn.user.name + ' has authorized client ' + txn.client.name + '.');
        }
        
        chai.oauth2orize.grant(activation({ inform: inform }, activate))
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
        
        chai.oauth2orize.grant(activation({ inform: inform }, activate))
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
        
        chai.oauth2orize.grant(activation({ inform: inform }, activate))
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
        
        chai.oauth2orize.grant(activation(activate))
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
        
        chai.oauth2orize.grant(activation(activate))
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
        
        chai.oauth2orize.grant(activation(activate))
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
        
        chai.oauth2orize.grant(activation({ inform: inform }, activate))
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
        
        chai.oauth2orize.grant(activation(activate))
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
