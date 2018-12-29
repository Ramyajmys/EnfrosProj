'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var PurchaseEntriesCtrlStub = {
  index: 'PurchaseEntriesCtrl.index',
  show: 'PurchaseEntriesCtrl.show',
  create: 'PurchaseEntriesCtrl.create',
  upsert: 'PurchaseEntriesCtrl.upsert',
  patch: 'PurchaseEntriesCtrl.patch',
  destroy: 'PurchaseEntriesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var PurchaseEntriesIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './PurchaseEntries.controller': PurchaseEntriesCtrlStub
});

describe('PurchaseEntries API Router:', function() {
  it('should return an express router instance', function() {
    PurchaseEntriesIndex.should.equal(routerStub);
  });

  describe('GET /api/PurchaseEntriess', function() {
    it('should route to PurchaseEntries.controller.index', function() {
      routerStub.get
        .withArgs('/', 'PurchaseEntriesCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/PurchaseEntriess/:id', function() {
    it('should route to PurchaseEntries.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'PurchaseEntriesCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/PurchaseEntriess', function() {
    it('should route to PurchaseEntries.controller.create', function() {
      routerStub.post
        .withArgs('/', 'PurchaseEntriesCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/PurchaseEntriess/:id', function() {
    it('should route to PurchaseEntries.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'PurchaseEntriesCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/PurchaseEntriess/:id', function() {
    it('should route to PurchaseEntries.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'PurchaseEntriesCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/PurchaseEntriess/:id', function() {
    it('should route to PurchaseEntries.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'PurchaseEntriesCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
