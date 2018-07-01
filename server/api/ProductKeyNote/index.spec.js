'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ProductKeyNoteCtrlStub = {
  index: 'ProductKeyNoteCtrl.index',
  show: 'ProductKeyNoteCtrl.show',
  create: 'ProductKeyNoteCtrl.create',
  upsert: 'ProductKeyNoteCtrl.upsert',
  patch: 'ProductKeyNoteCtrl.patch',
  destroy: 'ProductKeyNoteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProductKeyNoteIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ProductKeyNote.controller': ProductKeyNoteCtrlStub
});

describe('ProductKeyNote API Router:', function() {
  it('should return an express router instance', function() {
    ProductKeyNoteIndex.should.equal(routerStub);
  });

  describe('GET /api/ProductKeyNotes', function() {
    it('should route to ProductKeyNote.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProductKeyNoteCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ProductKeyNotes/:id', function() {
    it('should route to ProductKeyNote.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProductKeyNoteCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ProductKeyNotes', function() {
    it('should route to ProductKeyNote.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProductKeyNoteCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ProductKeyNotes/:id', function() {
    it('should route to ProductKeyNote.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ProductKeyNoteCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ProductKeyNotes/:id', function() {
    it('should route to ProductKeyNote.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ProductKeyNoteCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ProductKeyNotes/:id', function() {
    it('should route to ProductKeyNote.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProductKeyNoteCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
