'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductSplFeatureCtrlStub = {
  index: 'ProductSplFeatureCtrl.index',
  show: 'ProductSplFeatureCtrl.show',
  create: 'ProductSplFeatureCtrl.create',
  upsert: 'ProductSplFeatureCtrl.upsert',
  patch: 'ProductSplFeatureCtrl.patch',
  destroy: 'ProductSplFeatureCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductSplFeatureIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductSplFeature.controller': ProductSplFeatureCtrlStub
});

describe('ProductSplFeature API Router:', function() {
  it('should return an express router instance', function() {
    ProductSplFeatureIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductSplFeatures', function() {
    it('should route to ProductSplFeature.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductSplFeatureCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductSplFeatures/:id', function() {
    it('should route to ProductSplFeature.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductSplFeatureCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductSplFeatures', function() {
    it('should route to ProductSplFeature.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductSplFeatureCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductSplFeatures/:id', function() {
    it('should route to ProductSplFeature.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductSplFeatureCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductSplFeatures/:id', function() {
    it('should route to ProductSplFeature.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductSplFeatureCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductSplFeatures/:id', function() {
    it('should route to ProductSplFeature.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductSplFeatureCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
