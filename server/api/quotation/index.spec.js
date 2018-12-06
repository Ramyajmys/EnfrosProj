'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var quotationCtrlStub = {
  index: 'quotationCtrl.index',
  show: 'quotationCtrl.show',
  create: 'quotationCtrl.create',
  upsert: 'quotationCtrl.upsert',
  patch: 'quotationCtrl.patch',
  destroy: 'quotationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var quotationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './quotation.controller': quotationCtrlStub
});

describe('Quotation API Router:', function() {
  it('should return an express router instance', function() {
    quotationIndex.should.equal(routerStub);
  });

  describe('GET /api/quotations', function() {
    it('should route to quotation.controller.index', function() {
      routerStub.get
        .withArgs('/', 'quotationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/quotations/:id', function() {
    it('should route to quotation.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'quotationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/quotations', function() {
    it('should route to quotation.controller.create', function() {
      routerStub.post
        .withArgs('/', 'quotationCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/quotations/:id', function() {
    it('should route to quotation.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'quotationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/quotations/:id', function() {
    it('should route to quotation.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'quotationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/quotations/:id', function() {
    it('should route to quotation.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'quotationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
