'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductOutputAcDataCtrlStub = {
  index: 'ProductOutputAcDataCtrl.index',
  show: 'ProductOutputAcDataCtrl.show',
  create: 'ProductOutputAcDataCtrl.create',
  upsert: 'ProductOutputAcDataCtrl.upsert',
  patch: 'ProductOutputAcDataCtrl.patch',
  destroy: 'ProductOutputAcDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductOutputAcDataIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductOutputAcData.controller': ProductOutputAcDataCtrlStub
});

describe('ProductOutputAcData API Router:', function() {
  it('should return an express router instance', function() {
    ProductOutputAcDataIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductOutputAcDatas', function() {
    it('should route to ProductOutputAcData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductOutputAcDataCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductOutputAcDatas/:id', function() {
    it('should route to ProductOutputAcData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductOutputAcDataCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductOutputAcDatas', function() {
    it('should route to ProductOutputAcData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductOutputAcDataCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductOutputAcDatas/:id', function() {
    it('should route to ProductOutputAcData.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductOutputAcDataCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductOutputAcDatas/:id', function() {
    it('should route to ProductOutputAcData.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductOutputAcDataCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductOutputAcDatas/:id', function() {
    it('should route to ProductOutputAcData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductOutputAcDataCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
