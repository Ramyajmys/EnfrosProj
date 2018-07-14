'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newStatus;

describe('Status API:', function() {
  describe('GET /api/Status', function() {
    var Statuss;

    beforeEach(function(done) {
      request(app)
        .get('/api/Status')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Statuss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Statuss.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/Status', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Status')
        .send({
          name: 'New Status',
          info: 'This is the brand new Status!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStatus = res.body;
          done();
        });
    });

    it('should respond with the newly created Status', function() {
      newStatus.name.should.equal('New Status');
      newStatus.info.should.equal('This is the brand new Status!!!');
    });
  });

  describe('GET /api/Status/:id', function() {
    var Status;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Status/${newStatus._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Status = res.body;
          done();
        });
    });

    afterEach(function() {
      Status = {};
    });

    it('should respond with the requested Status', function() {
      Status.name.should.equal('New Status');
      Status.info.should.equal('This is the brand new Status!!!');
    });
  });

  describe('PUT /api/Status/:id', function() {
    var updatedStatus;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Status/${newStatus._id}`)
        .send({
          name: 'Updated Status',
          info: 'This is the updated Status!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStatus = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStatus = {};
    });

    it('should respond with the updated Status', function() {
      updatedStatus.name.should.equal('Updated Status');
      updatedStatus.info.should.equal('This is the updated Status!!!');
    });

    it('should respond with the updated Status on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Status/${newStatus._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Status = res.body;

          Status.name.should.equal('Updated Status');
          Status.info.should.equal('This is the updated Status!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Status/:id', function() {
    var patchedStatus;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Status/${newStatus._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Status' },
          { op: 'replace', path: '/info', value: 'This is the patched Status!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStatus = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStatus = {};
    });

    it('should respond with the patched Status', function() {
      patchedStatus.name.should.equal('Patched Status');
      patchedStatus.info.should.equal('This is the patched Status!!!');
    });
  });

  describe('DELETE /api/Status/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Status/${newStatus._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Status does not exist', function(done) {
      request(app)
        .delete(`/api/Status/${newStatus._id}`)
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
