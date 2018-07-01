'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductElectricalDataCtrlStub = {
  index: 'ProductElectricalDataCtrl.index',
  show: 'ProductElectricalDataCtrl.show',
  create: 'ProductElectricalDataCtrl.create',
  upsert: 'ProductElectricalDataCtrl.upsert',
  patch: 'ProductElectricalDataCtrl.patch',
  destroy: 'ProductElectricalDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductElectricalDataIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductElectricalData.controller': ProductElectricalDataCtrlStub
});

describe('ProductElectricalData API Router:', function() {
  it('should return an express router instance', function() {
    ProductElectricalDataIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductElectricalDatas', function() {
    it('should route to ProductElectricalData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductElectricalDataCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductElectricalDatas/:id', function() {
    it('should route to ProductElectricalData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductElectricalDataCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductElectricalDatas', function() {
    it('should route to ProductElectricalData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductElectricalDataCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductElectricalDatas/:id', function() {
    it('should route to ProductElectricalData.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductElectricalDataCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductElectricalDatas/:id', function() {
    it('should route to ProductElectricalData.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductElectricalDataCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductElectricalDatas/:id', function() {
    it('should route to ProductElectricalData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductElectricalDataCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
