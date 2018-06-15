'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductSubCategoryCtrlStub = {
  index: 'ProductSubCategoryCtrl.index',
  show: 'ProductSubCategoryCtrl.show',
  create: 'ProductSubCategoryCtrl.create',
  upsert: 'ProductSubCategoryCtrl.upsert',
  patch: 'ProductSubCategoryCtrl.patch',
  destroy: 'ProductSubCategoryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductSubCategoryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductSubCategory.controller': ProductSubCategoryCtrlStub
});

describe('ProductSubCategory API Router:', function() {
  it('should return an express router instance', function() {
    ProductSubCategoryIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductSubCategorys', function() {
    it('should route to ProductSubCategory.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductSubCategoryCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductSubCategorys/:id', function() {
    it('should route to ProductSubCategory.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductSubCategoryCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductSubCategorys', function() {
    it('should route to ProductSubCategory.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductSubCategoryCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductSubCategorys/:id', function() {
    it('should route to ProductSubCategory.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductSubCategoryCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductSubCategorys/:id', function() {
    it('should route to ProductSubCategory.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductSubCategoryCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductSubCategorys/:id', function() {
    it('should route to ProductSubCategory.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductSubCategoryCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
