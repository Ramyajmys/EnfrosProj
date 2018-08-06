'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductBatteryDataCtrlStub = {
  index: 'ProductBatteryDataCtrl.index',
  show: 'ProductBatteryDataCtrl.show',
  create: 'ProductBatteryDataCtrl.create',
  upsert: 'ProductBatteryDataCtrl.upsert',
  patch: 'ProductBatteryDataCtrl.patch',
  destroy: 'ProductBatteryDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductBatteryDataIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductBatteryData.controller': ProductBatteryDataCtrlStub
});

describe('ProductBatteryData API Router:', function() {
  it('should return an express router instance', function() {
    ProductBatteryDataIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductBatteryDatas', function() {
    it('should route to ProductBatteryData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductBatteryDataCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductBatteryDatas/:id', function() {
    it('should route to ProductBatteryData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductBatteryDataCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductBatteryDatas', function() {
    it('should route to ProductBatteryData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductBatteryDataCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductBatteryDatas/:id', function() {
    it('should route to ProductBatteryData.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductBatteryDataCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductBatteryDatas/:id', function() {
    it('should route to ProductBatteryData.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductBatteryDataCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductBatteryDatas/:id', function() {
    it('should route to ProductBatteryData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductBatteryDataCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
