'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var orderDetailCtrlStub = {
  index: 'orderDetailCtrl.index',
  show: 'orderDetailCtrl.show',
  create: 'orderDetailCtrl.create',
  upsert: 'orderDetailCtrl.upsert',
  patch: 'orderDetailCtrl.patch',
  destroy: 'orderDetailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var orderDetailIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './orderDetail.controller': orderDetailCtrlStub
});

describe('OrderDetail API Router:', function() {
  it('should return an express router instance', function() {
    orderDetailIndex.should.equal(routerStub);
  });

  describe('GET /api/orderDetails', function() {
    it('should route to orderDetail.controller.index', function() {
      routerStub.get
        .withArgs('/', 'orderDetailCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/orderDetails/:id', function() {
    it('should route to orderDetail.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'orderDetailCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/orderDetails', function() {
    it('should route to orderDetail.controller.create', function() {
      routerStub.post
        .withArgs('/', 'orderDetailCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/orderDetails/:id', function() {
    it('should route to orderDetail.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'orderDetailCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/orderDetails/:id', function() {
    it('should route to orderDetail.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'orderDetailCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/orderDetails/:id', function() {
    it('should route to orderDetail.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'orderDetailCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
