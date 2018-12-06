'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newQuotation;

describe('Quotation API:', function() {
  describe('GET /api/quotations', function() {
    var quotations;

    beforeEach(function(done) {
      request(app)
        .get('/api/quotations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          quotations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      quotations.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/quotations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/quotations')
        .send({
          name: 'New Quotation',
          info: 'This is the brand new quotation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newQuotation = res.body;
          done();
        });
    });

    it('should respond with the newly created quotation', function() {
      newQuotation.name.should.equal('New Quotation');
      newQuotation.info.should.equal('This is the brand new quotation!!!');
    });
  });

  describe('GET /api/quotations/:id', function() {
    var quotation;

    beforeEach(function(done) {
      request(app)
        .get(`/api/quotations/${newQuotation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          quotation = res.body;
          done();
        });
    });

    afterEach(function() {
      quotation = {};
    });

    it('should respond with the requested quotation', function() {
      quotation.name.should.equal('New Quotation');
      quotation.info.should.equal('This is the brand new quotation!!!');
    });
  });

  describe('PUT /api/quotations/:id', function() {
    var updatedQuotation;

    beforeEach(function(done) {
      request(app)
        .put(`/api/quotations/${newQuotation._id}`)
        .send({
          name: 'Updated Quotation',
          info: 'This is the updated quotation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedQuotation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedQuotation = {};
    });

    it('should respond with the updated quotation', function() {
      updatedQuotation.name.should.equal('Updated Quotation');
      updatedQuotation.info.should.equal('This is the updated quotation!!!');
    });

    it('should respond with the updated quotation on a subsequent GET', function(done) {
      request(app)
        .get(`/api/quotations/${newQuotation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let quotation = res.body;

          quotation.name.should.equal('Updated Quotation');
          quotation.info.should.equal('This is the updated quotation!!!');

          done();
        });
    });
  });

  describe('PATCH /api/quotations/:id', function() {
    var patchedQuotation;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/quotations/${newQuotation._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Quotation' },
          { op: 'replace', path: '/info', value: 'This is the patched quotation!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedQuotation = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedQuotation = {};
    });

    it('should respond with the patched quotation', function() {
      patchedQuotation.name.should.equal('Patched Quotation');
      patchedQuotation.info.should.equal('This is the patched quotation!!!');
    });
  });

  describe('DELETE /api/quotations/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/quotations/${newQuotation._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when quotation does not exist', function(done) {
      request(app)
        .delete(`/api/quotations/${newQuotation._id}`)
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
