'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductDetailCtrlStub = {
  index: 'ProductDetailCtrl.index',
  show: 'ProductDetailCtrl.show',
  create: 'ProductDetailCtrl.create',
  upsert: 'ProductDetailCtrl.upsert',
  patch: 'ProductDetailCtrl.patch',
  destroy: 'ProductDetailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductDetailIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductDetail.controller': ProductDetailCtrlStub
});

describe('ProductDetail API Router:', function() {
  it('should return an express router instance', function() {
    ProductDetailIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductDetails', function() {
    it('should route to ProductDetail.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductDetailCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductDetails/:id', function() {
    it('should route to ProductDetail.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductDetailCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductDetails', function() {
    it('should route to ProductDetail.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductDetailCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductDetails/:id', function() {
    it('should route to ProductDetail.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductDetailCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductDetails/:id', function() {
    it('should route to ProductDetail.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductDetailCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductDetails/:id', function() {
    it('should route to ProductDetail.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductDetailCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
