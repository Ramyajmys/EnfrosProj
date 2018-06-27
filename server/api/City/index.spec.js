'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var CityCtrlStub = {
  index: 'CityCtrl.index',
  show: 'CityCtrl.show',
  create: 'CityCtrl.create',
  upsert: 'CityCtrl.upsert',
  patch: 'CityCtrl.patch',
  destroy: 'CityCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var CityIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './City.controller': CityCtrlStub
});

describe('City API Router:', function() {
  it('should return an express router instance', function() {
    CityIndex.should.equal(routerStub);
  });

  describe('GET /api/Citys', function() {
    it('should route to City.controller.index', function() {
      routerStub.get
        .withArgs('/', 'CityCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/Citys/:id', function() {
    it('should route to City.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'CityCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/Citys', function() {
    it('should route to City.controller.create', function() {
      routerStub.post
        .withArgs('/', 'CityCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/Citys/:id', function() {
    it('should route to City.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'CityCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/Citys/:id', function() {
    it('should route to City.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'CityCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/Citys/:id', function() {
    it('should route to City.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'CityCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
