'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newHSN;

describe('HSN API:', function() {
  describe('GET /api/HSNs', function() {
    var HSNs;

    beforeEach(function(done) {
      request(app)
        .get('/api/HSNs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          HSNs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      HSNs.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/HSNs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/HSNs')
        .send({
          name: 'New HSN',
          info: 'This is the brand new HSN!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newHSN = res.body;
          done();
        });
    });

    it('should respond with the newly created HSN', function() {
      newHSN.name.should.equal('New HSN');
      newHSN.info.should.equal('This is the brand new HSN!!!');
    });
  });

  describe('GET /api/HSNs/:id', function() {
    var HSN;

    beforeEach(function(done) {
      request(app)
        .get(`/api/HSNs/${newHSN._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          HSN = res.body;
          done();
        });
    });

    afterEach(function() {
      HSN = {};
    });

    it('should respond with the requested HSN', function() {
      HSN.name.should.equal('New HSN');
      HSN.info.should.equal('This is the brand new HSN!!!');
    });
  });

  describe('PUT /api/HSNs/:id', function() {
    var updatedHSN;

    beforeEach(function(done) {
      request(app)
        .put(`/api/HSNs/${newHSN._id}`)
        .send({
          name: 'Updated HSN',
          info: 'This is the updated HSN!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedHSN = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedHSN = {};
    });

    it('should respond with the updated HSN', function() {
      updatedHSN.name.should.equal('Updated HSN');
      updatedHSN.info.should.equal('This is the updated HSN!!!');
    });

    it('should respond with the updated HSN on a subsequent GET', function(done) {
      request(app)
        .get(`/api/HSNs/${newHSN._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let HSN = res.body;

          HSN.name.should.equal('Updated HSN');
          HSN.info.should.equal('This is the updated HSN!!!');

          done();
        });
    });
  });

  describe('PATCH /api/HSNs/:id', function() {
    var patchedHSN;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/HSNs/${newHSN._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched HSN' },
          { op: 'replace', path: '/info', value: 'This is the patched HSN!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedHSN = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedHSN = {};
    });

    it('should respond with the patched HSN', function() {
      patchedHSN.name.should.equal('Patched HSN');
      patchedHSN.info.should.equal('This is the patched HSN!!!');
    });
  });

  describe('DELETE /api/HSNs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/HSNs/${newHSN._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when HSN does not exist', function(done) {
      request(app)
        .delete(`/api/HSNs/${newHSN._id}`)
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
