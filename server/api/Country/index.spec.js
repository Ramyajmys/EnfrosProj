'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var CountryCtrlStub = {
  index: 'CountryCtrl.index',
  show: 'CountryCtrl.show',
  create: 'CountryCtrl.create',
  upsert: 'CountryCtrl.upsert',
  patch: 'CountryCtrl.patch',
  destroy: 'CountryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var CountryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './Country.controller': CountryCtrlStub
});

describe('Country API Router:', function() {
  it('should return an express router instance', function() {
    CountryIndex.should.equal(routerStub);
  });

  describe('GET /api/Countrys', function() {
    it('should route to Country.controller.index', function() {
      routerStub.get
        .withArgs('/', 'CountryCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/Countrys/:id', function() {
    it('should route to Country.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'CountryCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/Countrys', function() {
    it('should route to Country.controller.create', function() {
      routerStub.post
        .withArgs('/', 'CountryCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/Countrys/:id', function() {
    it('should route to Country.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'CountryCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Countrys/:id', function() {
    it('should route to Country.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'CountryCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Countrys/:id', function() {
    it('should route to Country.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'CountryCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
