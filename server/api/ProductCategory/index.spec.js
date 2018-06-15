'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductCategoryCtrlStub = {
  index: 'ProductCategoryCtrl.index',
  show: 'ProductCategoryCtrl.show',
  create: 'ProductCategoryCtrl.create',
  upsert: 'ProductCategoryCtrl.upsert',
  patch: 'ProductCategoryCtrl.patch',
  destroy: 'ProductCategoryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductCategoryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductCategory.controller': ProductCategoryCtrlStub
});

describe('ProductCategory API Router:', function() {
  it('should return an express router instance', function() {
    ProductCategoryIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductCategorys', function() {
    it('should route to ProductCategory.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductCategoryCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductCategorys/:id', function() {
    it('should route to ProductCategory.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductCategoryCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductCategorys', function() {
    it('should route to ProductCategory.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductCategoryCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductCategorys/:id', function() {
    it('should route to ProductCategory.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductCategoryCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductCategorys/:id', function() {
    it('should route to ProductCategory.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductCategoryCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductCategorys/:id', function() {
    it('should route to ProductCategory.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductCategoryCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
