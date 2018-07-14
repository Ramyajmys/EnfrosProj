'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var StatusCtrlStub = {
  index: 'StatusCtrl.index',
  show: 'StatusCtrl.show',
  create: 'StatusCtrl.create',
  upsert: 'StatusCtrl.upsert',
  patch: 'StatusCtrl.patch',
  destroy: 'StatusCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var StatusIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Status.controller': StatusCtrlStub
});

describe('Status API Router:', function() {
  it('should return an express router instance', function() {
    StatusIndex.should.equal(routerStub);
  });

  describe('GET /api/Status', function() {
    it('should route to Status.controller.index', function() {
      routerStub.get
        .withArgs('/', 'StatusCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/Status/:id', function() {
    it('should route to Status.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'StatusCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/Status', function() {
    it('should route to Status.controller.create', function() {
      routerStub.post
        .withArgs('/', 'StatusCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/Status/:id', function() {
    it('should route to Status.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'StatusCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Status/:id', function() {
    it('should route to Status.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'StatusCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Status/:id', function() {
    it('should route to Status.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'StatusCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
