'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductInputDcDataCtrlStub = {
  index: 'ProductInputDcDataCtrl.index',
  show: 'ProductInputDcDataCtrl.show',
  create: 'ProductInputDcDataCtrl.create',
  upsert: 'ProductInputDcDataCtrl.upsert',
  patch: 'ProductInputDcDataCtrl.patch',
  destroy: 'ProductInputDcDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductInputDcDataIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductInputDcData.controller': ProductInputDcDataCtrlStub
});

describe('ProductInputDcData API Router:', function() {
  it('should return an express router instance', function() {
    ProductInputDcDataIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductInputDcDatas', function() {
    it('should route to ProductInputDcData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductInputDcDataCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductInputDcDatas/:id', function() {
    it('should route to ProductInputDcData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductInputDcDataCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductInputDcDatas', function() {
    it('should route to ProductInputDcData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductInputDcDataCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductInputDcDatas/:id', function() {
    it('should route to ProductInputDcData.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductInputDcDataCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductInputDcDatas/:id', function() {
    it('should route to ProductInputDcData.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductInputDcDataCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductInputDcDatas/:id', function() {
    it('should route to ProductInputDcData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductInputDcDataCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
