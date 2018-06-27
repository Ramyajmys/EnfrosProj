'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newUserProfile;

describe('UserProfile API:', function() {
  describe('GET /api/UserProfiles', function() {
    var UserProfiles;

    beforeEach(function(done) {
      request(app)
        .get('/api/UserProfiles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          UserProfiles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      UserProfiles.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/UserProfiles', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/UserProfiles')
        .send({
          name: 'New UserProfile',
          info: 'This is the brand new UserProfile!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newUserProfile = res.body;
          done();
        });
    });

    it('should respond with the newly created UserProfile', function() {
      newUserProfile.name.should.equal('New UserProfile');
      newUserProfile.info.should.equal('This is the brand new UserProfile!!!');
    });
  });

  describe('GET /api/UserProfiles/:id', function() {
    var UserProfile;

    beforeEach(function(done) {
      request(app)
        .get(`/api/UserProfiles/${newUserProfile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          UserProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      UserProfile = {};
    });

    it('should respond with the requested UserProfile', function() {
      UserProfile.name.should.equal('New UserProfile');
      UserProfile.info.should.equal('This is the brand new UserProfile!!!');
    });
  });

  describe('PUT /api/UserProfiles/:id', function() {
    var updatedUserProfile;

    beforeEach(function(done) {
      request(app)
        .put(`/api/UserProfiles/${newUserProfile._id}`)
        .send({
          name: 'Updated UserProfile',
          info: 'This is the updated UserProfile!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedUserProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUserProfile = {};
    });

    it('should respond with the updated UserProfile', function() {
      updatedUserProfile.name.should.equal('Updated UserProfile');
      updatedUserProfile.info.should.equal('This is the updated UserProfile!!!');
    });

    it('should respond with the updated UserProfile on a subsequent GET', function(done) {
      request(app)
        .get(`/api/UserProfiles/${newUserProfile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let UserProfile = res.body;

          UserProfile.name.should.equal('Updated UserProfile');
          UserProfile.info.should.equal('This is the updated UserProfile!!!');

          done();
        });
    });
  });

  describe('PATCH /api/UserProfiles/:id', function() {
    var patchedUserProfile;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/UserProfiles/${newUserProfile._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched UserProfile' },
          { op: 'replace', path: '/info', value: 'This is the patched UserProfile!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedUserProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedUserProfile = {};
    });

    it('should respond with the patched UserProfile', function() {
      patchedUserProfile.name.should.equal('Patched UserProfile');
      patchedUserProfile.info.should.equal('This is the patched UserProfile!!!');
    });
  });

  describe('DELETE /api/UserProfiles/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/UserProfiles/${newUserProfile._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when UserProfile does not exist', function(done) {
      request(app)
        .delete(`/api/UserProfiles/${newUserProfile._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
