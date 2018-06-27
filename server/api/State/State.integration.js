'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newState;

describe('State API:', function() {
  describe('GET /api/States', function() {
    var States;

    beforeEach(function(done) {
      request(app)
        .get('/api/States')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          States = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      States.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/States', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/States')
        .send({
          name: 'New State',
          info: 'This is the brand new State!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newState = res.body;
          done();
        });
    });

    it('should respond with the newly created State', function() {
      newState.name.should.equal('New State');
      newState.info.should.equal('This is the brand new State!!!');
    });
  });

  describe('GET /api/States/:id', function() {
    var State;

    beforeEach(function(done) {
      request(app)
        .get(`/api/States/${newState._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          State = res.body;
          done();
        });
    });

    afterEach(function() {
      State = {};
    });

    it('should respond with the requested State', function() {
      State.name.should.equal('New State');
      State.info.should.equal('This is the brand new State!!!');
    });
  });

  describe('PUT /api/States/:id', function() {
    var updatedState;

    beforeEach(function(done) {
      request(app)
        .put(`/api/States/${newState._id}`)
        .send({
          name: 'Updated State',
          info: 'This is the updated State!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedState = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedState = {};
    });

    it('should respond with the updated State', function() {
      updatedState.name.should.equal('Updated State');
      updatedState.info.should.equal('This is the updated State!!!');
    });

    it('should respond with the updated State on a subsequent GET', function(done) {
      request(app)
        .get(`/api/States/${newState._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let State = res.body;

          State.name.should.equal('Updated State');
          State.info.should.equal('This is the updated State!!!');

          done();
        });
    });
  });

  describe('PATCH /api/States/:id', function() {
    var patchedState;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/States/${newState._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched State' },
          { op: 'replace', path: '/info', value: 'This is the patched State!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedState = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedState = {};
    });

    it('should respond with the patched State', function() {
      patchedState.name.should.equal('Patched State');
      patchedState.info.should.equal('This is the patched State!!!');
    });
  });

  describe('DELETE /api/States/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/States/${newState._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when State does not exist', function(done) {
      request(app)
        .delete(`/api/States/${newState._id}`)
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
