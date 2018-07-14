'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var testCtrlStub = {
  index: 'testCtrl.index',
  show: 'testCtrl.show',
  create: 'testCtrl.create',
  upsert: 'testCtrl.upsert',
  patch: 'testCtrl.patch',
  destroy: 'testCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var testIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './test.controller': testCtrlStub
});

describe('Test API Router:', function() {
  it('should return an express router instance', function() {
    testIndex.should.equal(routerStub);
  });

  describe('GET /test', function() {
    it('should route to test.controller.index', function() {
      routerStub.get
        .withArgs('/', 'testCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /test/:id', function() {
    it('should route to test.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'testCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /test', function() {
    it('should route to test.controller.create', function() {
      routerStub.post
        .withArgs('/', 'testCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /test/:id', function() {
    it('should route to test.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'testCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /test/:id', function() {
    it('should route to test.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'testCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /test/:id', function() {
    it('should route to test.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'testCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
