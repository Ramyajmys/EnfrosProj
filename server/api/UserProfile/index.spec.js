'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var UserProfileCtrlStub = {
  index: 'UserProfileCtrl.index',
  show: 'UserProfileCtrl.show',
  create: 'UserProfileCtrl.create',
  upsert: 'UserProfileCtrl.upsert',
  patch: 'UserProfileCtrl.patch',
  destroy: 'UserProfileCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var UserProfileIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './UserProfile.controller': UserProfileCtrlStub
});

describe('UserProfile API Router:', function() {
  it('should return an express router instance', function() {
    UserProfileIndex.should.equal(routerStub);
  });

  describe('GET /api/UserProfiles', function() {
    it('should route to UserProfile.controller.index', function() {
      routerStub.get
        .withArgs('/', 'UserProfileCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/UserProfiles/:id', function() {
    it('should route to UserProfile.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'UserProfileCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/UserProfiles', function() {
    it('should route to UserProfile.controller.create', function() {
      routerStub.post
        .withArgs('/', 'UserProfileCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/UserProfiles/:id', function() {
    it('should route to UserProfile.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'UserProfileCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/UserProfiles/:id', function() {
    it('should route to UserProfile.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'UserProfileCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/UserProfiles/:id', function() {
    it('should route to UserProfile.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'UserProfileCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
