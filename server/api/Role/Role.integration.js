'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newRole;

describe('Role API:', function() {
  describe('GET /api/Roles', function() {
    var Roles;

    beforeEach(function(done) {
      request(app)
        .get('/api/Roles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Roles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Roles.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/Roles', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Roles')
        .send({
          name: 'New Role',
          info: 'This is the brand new Role!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newRole = res.body;
          done();
        });
    });

    it('should respond with the newly created Role', function() {
      newRole.name.should.equal('New Role');
      newRole.info.should.equal('This is the brand new Role!!!');
    });
  });

  describe('GET /api/Roles/:id', function() {
    var Role;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Roles/${newRole._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Role = res.body;
          done();
        });
    });

    afterEach(function() {
      Role = {};
    });

    it('should respond with the requested Role', function() {
      Role.name.should.equal('New Role');
      Role.info.should.equal('This is the brand new Role!!!');
    });
  });

  describe('PUT /api/Roles/:id', function() {
    var updatedRole;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Roles/${newRole._id}`)
        .send({
          name: 'Updated Role',
          info: 'This is the updated Role!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedRole = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRole = {};
    });

    it('should respond with the updated Role', function() {
      updatedRole.name.should.equal('Updated Role');
      updatedRole.info.should.equal('This is the updated Role!!!');
    });

    it('should respond with the updated Role on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Roles/${newRole._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Role = res.body;

          Role.name.should.equal('Updated Role');
          Role.info.should.equal('This is the updated Role!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Roles/:id', function() {
    var patchedRole;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Roles/${newRole._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Role' },
          { op: 'replace', path: '/info', value: 'This is the patched Role!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedRole = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedRole = {};
    });

    it('should respond with the patched Role', function() {
      patchedRole.name.should.equal('Patched Role');
      patchedRole.info.should.equal('This is the patched Role!!!');
    });
  });

  describe('DELETE /api/Roles/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Roles/${newRole._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Role does not exist', function(done) {
      request(app)
        .delete(`/api/Roles/${newRole._id}`)
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
