'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductBrochureCtrlStub = {
  index: 'ProductBrochureCtrl.index',
  show: 'ProductBrochureCtrl.show',
  create: 'ProductBrochureCtrl.create',
  upsert: 'ProductBrochureCtrl.upsert',
  patch: 'ProductBrochureCtrl.patch',
  destroy: 'ProductBrochureCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductBrochureIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductBrochure.controller': ProductBrochureCtrlStub
});

describe('ProductBrochure API Router:', function() {
  it('should return an express router instance', function() {
    ProductBrochureIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductBrochures', function() {
    it('should route to ProductBrochure.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductBrochureCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductBrochures/:id', function() {
    it('should route to ProductBrochure.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductBrochureCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductBrochures', function() {
    it('should route to ProductBrochure.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductBrochureCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductBrochures/:id', function() {
    it('should route to ProductBrochure.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductBrochureCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductBrochures/:id', function() {
    it('should route to ProductBrochure.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductBrochureCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductBrochures/:id', function() {
    it('should route to ProductBrochure.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductBrochureCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
