'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductKitsDataCtrlStub = {
  index: 'ProductKitsDataCtrl.index',
  show: 'ProductKitsDataCtrl.show',
  create: 'ProductKitsDataCtrl.create',
  upsert: 'ProductKitsDataCtrl.upsert',
  patch: 'ProductKitsDataCtrl.patch',
  destroy: 'ProductKitsDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductKitsDataIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductKitsData.controller': ProductKitsDataCtrlStub
});

describe('ProductKitsData API Router:', function() {
  it('should return an express router instance', function() {
    ProductKitsDataIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductKitsDatas', function() {
    it('should route to ProductKitsData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductKitsDataCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductKitsDatas/:id', function() {
    it('should route to ProductKitsData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductKitsDataCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductKitsDatas', function() {
    it('should route to ProductKitsData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductKitsDataCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductKitsDatas/:id', function() {
    it('should route to ProductKitsData.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductKitsDataCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductKitsDatas/:id', function() {
    it('should route to ProductKitsData.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductKitsDataCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductKitsDatas/:id', function() {
    it('should route to ProductKitsData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductKitsDataCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
