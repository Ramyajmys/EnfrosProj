'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newTest;

describe('Test API:', function() {
  describe('GET /test', function() {
    var tests;

    beforeEach(function(done) {
      request(app)
        .get('/test')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          tests = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      tests.should.be.instanceOf(Array);
    });
  });

  describe('POST /test', function() {
    beforeEach(function(done) {
      request(app)
        .post('/test')
        .send({
          name: 'New Test',
          info: 'This is the brand new test!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTest = res.body;
          done();
        });
    });

    it('should respond with the newly created test', function() {
      newTest.name.should.equal('New Test');
      newTest.info.should.equal('This is the brand new test!!!');
    });
  });

  describe('GET /test/:id', function() {
    var test;

    beforeEach(function(done) {
      request(app)
        .get(`/test/${newTest._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          test = res.body;
          done();
        });
    });

    afterEach(function() {
      test = {};
    });

    it('should respond with the requested test', function() {
      test.name.should.equal('New Test');
      test.info.should.equal('This is the brand new test!!!');
    });
  });

  describe('PUT /test/:id', function() {
    var updatedTest;

    beforeEach(function(done) {
      request(app)
        .put(`/test/${newTest._id}`)
        .send({
          name: 'Updated Test',
          info: 'This is the updated test!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTest = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTest = {};
    });

    it('should respond with the updated test', function() {
      updatedTest.name.should.equal('Updated Test');
      updatedTest.info.should.equal('This is the updated test!!!');
    });

    it('should respond with the updated test on a subsequent GET', function(done) {
      request(app)
        .get(`/test/${newTest._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let test = res.body;

          test.name.should.equal('Updated Test');
          test.info.should.equal('This is the updated test!!!');

          done();
        });
    });
  });

  describe('PATCH /test/:id', function() {
    var patchedTest;

    beforeEach(function(done) {
      request(app)
        .patch(`/test/${newTest._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Test' },
          { op: 'replace', path: '/info', value: 'This is the patched test!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTest = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTest = {};
    });

    it('should respond with the patched test', function() {
      patchedTest.name.should.equal('Patched Test');
      patchedTest.info.should.equal('This is the patched test!!!');
    });
  });

  describe('DELETE /test/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/test/${newTest._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when test does not exist', function(done) {
      request(app)
        .delete(`/test/${newTest._id}`)
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
