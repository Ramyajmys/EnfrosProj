'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var StateCtrlStub = {
  index: 'StateCtrl.index',
  show: 'StateCtrl.show',
  create: 'StateCtrl.create',
  upsert: 'StateCtrl.upsert',
  patch: 'StateCtrl.patch',
  destroy: 'StateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var StateIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './State.controller': StateCtrlStub
});

describe('State API Router:', function() {
  it('should return an express router instance', function() {
    StateIndex.should.equal(routerStub);
  });

  describe('GET /api/States', function() {
    it('should route to State.controller.index', function() {
      routerStub.get
        .withArgs('/', 'StateCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/States/:id', function() {
    it('should route to State.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'StateCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/States', function() {
    it('should route to State.controller.create', function() {
      routerStub.post
        .withArgs('/', 'StateCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/States/:id', function() {
    it('should route to State.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'StateCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/States/:id', function() {
    it('should route to State.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'StateCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/States/:id', function() {
    it('should route to State.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'StateCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
