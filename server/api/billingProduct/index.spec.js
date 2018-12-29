'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var billingProductCtrlStub = {
  index: 'billingProductCtrl.index',
  show: 'billingProductCtrl.show',
  create: 'billingProductCtrl.create',
  upsert: 'billingProductCtrl.upsert',
  patch: 'billingProductCtrl.patch',
  destroy: 'billingProductCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var billingProductIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './billingProduct.controller': billingProductCtrlStub
});

describe('BillingProduct API Router:', function() {
  it('should return an express router instance', function() {
    billingProductIndex.should.equal(routerStub);
  });

  describe('GET /api/billingProducts', function() {
    it('should route to billingProduct.controller.index', function() {
      routerStub.get
        .withArgs('/', 'billingProductCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/billingProducts/:id', function() {
    it('should route to billingProduct.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'billingProductCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/billingProducts', function() {
    it('should route to billingProduct.controller.create', function() {
      routerStub.post
        .withArgs('/', 'billingProductCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/billingProducts/:id', function() {
    it('should route to billingProduct.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'billingProductCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/billingProducts/:id', function() {
    it('should route to billingProduct.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'billingProductCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/billingProducts/:id', function() {
    it('should route to billingProduct.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'billingProductCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
