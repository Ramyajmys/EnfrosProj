'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPurchaseEntries;

describe('PurchaseEntries API:', function() {
  describe('GET /api/PurchaseEntriess', function() {
    var PurchaseEntriess;

    beforeEach(function(done) {
      request(app)
        .get('/api/PurchaseEntriess')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          PurchaseEntriess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      PurchaseEntriess.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/PurchaseEntriess', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/PurchaseEntriess')
        .send({
          name: 'New PurchaseEntries',
          info: 'This is the brand new PurchaseEntries!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPurchaseEntries = res.body;
          done();
        });
    });

    it('should respond with the newly created PurchaseEntries', function() {
      newPurchaseEntries.name.should.equal('New PurchaseEntries');
      newPurchaseEntries.info.should.equal('This is the brand new PurchaseEntries!!!');
    });
  });

  describe('GET /api/PurchaseEntriess/:id', function() {
    var PurchaseEntries;

    beforeEach(function(done) {
      request(app)
        .get(`/api/PurchaseEntriess/${newPurchaseEntries._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          PurchaseEntries = res.body;
          done();
        });
    });

    afterEach(function() {
      PurchaseEntries = {};
    });

    it('should respond with the requested PurchaseEntries', function() {
      PurchaseEntries.name.should.equal('New PurchaseEntries');
      PurchaseEntries.info.should.equal('This is the brand new PurchaseEntries!!!');
    });
  });

  describe('PUT /api/PurchaseEntriess/:id', function() {
    var updatedPurchaseEntries;

    beforeEach(function(done) {
      request(app)
        .put(`/api/PurchaseEntriess/${newPurchaseEntries._id}`)
        .send({
          name: 'Updated PurchaseEntries',
          info: 'This is the updated PurchaseEntries!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPurchaseEntries = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPurchaseEntries = {};
    });

    it('should respond with the updated PurchaseEntries', function() {
      updatedPurchaseEntries.name.should.equal('Updated PurchaseEntries');
      updatedPurchaseEntries.info.should.equal('This is the updated PurchaseEntries!!!');
    });

    it('should respond with the updated PurchaseEntries on a subsequent GET', function(done) {
      request(app)
        .get(`/api/PurchaseEntriess/${newPurchaseEntries._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let PurchaseEntries = res.body;

          PurchaseEntries.name.should.equal('Updated PurchaseEntries');
          PurchaseEntries.info.should.equal('This is the updated PurchaseEntries!!!');

          done();
        });
    });
  });

  describe('PATCH /api/PurchaseEntriess/:id', function() {
    var patchedPurchaseEntries;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/PurchaseEntriess/${newPurchaseEntries._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched PurchaseEntries' },
          { op: 'replace', path: '/info', value: 'This is the patched PurchaseEntries!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPurchaseEntries = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPurchaseEntries = {};
    });

    it('should respond with the patched PurchaseEntries', function() {
      patchedPurchaseEntries.name.should.equal('Patched PurchaseEntries');
      patchedPurchaseEntries.info.should.equal('This is the patched PurchaseEntries!!!');
    });
  });

  describe('DELETE /api/PurchaseEntriess/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/PurchaseEntriess/${newPurchaseEntries._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when PurchaseEntries does not exist', function(done) {
      request(app)
        .delete(`/api/PurchaseEntriess/${newPurchaseEntries._id}`)
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
