'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductCableDataCtrlStub = {
  index: 'ProductCableDataCtrl.index',
  show: 'ProductCableDataCtrl.show',
  create: 'ProductCableDataCtrl.create',
  upsert: 'ProductCableDataCtrl.upsert',
  patch: 'ProductCableDataCtrl.patch',
  destroy: 'ProductCableDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductCableDataIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductCableData.controller': ProductCableDataCtrlStub
});

describe('ProductCableData API Router:', function() {
  it('should return an express router instance', function() {
    ProductCableDataIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductCableDatas', function() {
    it('should route to ProductCableData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductCableDataCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductCableDatas/:id', function() {
    it('should route to ProductCableData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductCableDataCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductCableDatas', function() {
    it('should route to ProductCableData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductCableDataCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductCableDatas/:id', function() {
    it('should route to ProductCableData.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductCableDataCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductCableDatas/:id', function() {
    it('should route to ProductCableData.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductCableDataCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductCableDatas/:id', function() {
    it('should route to ProductCableData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductCableDataCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
