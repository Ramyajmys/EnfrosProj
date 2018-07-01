'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var HSNCtrlStub = {
  index: 'HSNCtrl.index',
  show: 'HSNCtrl.show',
  create: 'HSNCtrl.create',
  upsert: 'HSNCtrl.upsert',
  patch: 'HSNCtrl.patch',
  destroy: 'HSNCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var HSNIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './HSN.controller': HSNCtrlStub
});

describe('HSN API Router:', function() {
  it('should return an express router instance', function() {
    HSNIndex.should.equal(routerStub);
  });

  describe('GET /api/HSNs', function() {
    it('should route to HSN.controller.index', function() {
      routerStub.get
        .withArgs('/', 'HSNCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/HSNs/:id', function() {
    it('should route to HSN.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'HSNCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/HSNs', function() {
    it('should route to HSN.controller.create', function() {
      routerStub.post
        .withArgs('/', 'HSNCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/HSNs/:id', function() {
    it('should route to HSN.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'HSNCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/HSNs/:id', function() {
    it('should route to HSN.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'HSNCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/HSNs/:id', function() {
    it('should route to HSN.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'HSNCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
