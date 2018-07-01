'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductMechanicalDataCtrlStub = {
  index: 'ProductMechanicalDataCtrl.index',
  show: 'ProductMechanicalDataCtrl.show',
  create: 'ProductMechanicalDataCtrl.create',
  upsert: 'ProductMechanicalDataCtrl.upsert',
  patch: 'ProductMechanicalDataCtrl.patch',
  destroy: 'ProductMechanicalDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductMechanicalDataIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductMechanicalData.controller': ProductMechanicalDataCtrlStub
});

describe('ProductMechanicalData API Router:', function() {
  it('should return an express router instance', function() {
    ProductMechanicalDataIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductMechanicalDatas', function() {
    it('should route to ProductMechanicalData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductMechanicalDataCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductMechanicalDatas/:id', function() {
    it('should route to ProductMechanicalData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductMechanicalDataCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductMechanicalDatas', function() {
    it('should route to ProductMechanicalData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductMechanicalDataCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductMechanicalDatas/:id', function() {
    it('should route to ProductMechanicalData.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductMechanicalDataCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductMechanicalDatas/:id', function() {
    it('should route to ProductMechanicalData.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductMechanicalDataCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductMechanicalDatas/:id', function() {
    it('should route to ProductMechanicalData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductMechanicalDataCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
