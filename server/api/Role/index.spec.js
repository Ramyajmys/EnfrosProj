'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var RoleCtrlStub = {
  index: 'RoleCtrl.index',
  show: 'RoleCtrl.show',
  create: 'RoleCtrl.create',
  upsert: 'RoleCtrl.upsert',
  patch: 'RoleCtrl.patch',
  destroy: 'RoleCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var RoleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Role.controller': RoleCtrlStub
});

describe('Role API Router:', function() {
  it('should return an express router instance', function() {
    RoleIndex.should.equal(routerStub);
  });

  describe('GET /api/Roles', function() {
    it('should route to Role.controller.index', function() {
      routerStub.get
        .withArgs('/', 'RoleCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/Roles/:id', function() {
    it('should route to Role.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'RoleCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/Roles', function() {
    it('should route to Role.controller.create', function() {
      routerStub.post
        .withArgs('/', 'RoleCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/Roles/:id', function() {
    it('should route to Role.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'RoleCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Roles/:id', function() {
    it('should route to Role.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'RoleCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Roles/:id', function() {
    it('should route to Role.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'RoleCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
