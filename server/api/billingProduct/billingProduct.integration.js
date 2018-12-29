'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBillingProduct;

describe('BillingProduct API:', function() {
  describe('GET /api/billingProducts', function() {
    var billingProducts;

    beforeEach(function(done) {
      request(app)
        .get('/api/billingProducts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          billingProducts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      billingProducts.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/billingProducts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/billingProducts')
        .send({
          name: 'New BillingProduct',
          info: 'This is the brand new billingProduct!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBillingProduct = res.body;
          done();
        });
    });

    it('should respond with the newly created billingProduct', function() {
      newBillingProduct.name.should.equal('New BillingProduct');
      newBillingProduct.info.should.equal('This is the brand new billingProduct!!!');
    });
  });

  describe('GET /api/billingProducts/:id', function() {
    var billingProduct;

    beforeEach(function(done) {
      request(app)
        .get(`/api/billingProducts/${newBillingProduct._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          billingProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      billingProduct = {};
    });

    it('should respond with the requested billingProduct', function() {
      billingProduct.name.should.equal('New BillingProduct');
      billingProduct.info.should.equal('This is the brand new billingProduct!!!');
    });
  });

  describe('PUT /api/billingProducts/:id', function() {
    var updatedBillingProduct;

    beforeEach(function(done) {
      request(app)
        .put(`/api/billingProducts/${newBillingProduct._id}`)
        .send({
          name: 'Updated BillingProduct',
          info: 'This is the updated billingProduct!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBillingProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBillingProduct = {};
    });

    it('should respond with the updated billingProduct', function() {
      updatedBillingProduct.name.should.equal('Updated BillingProduct');
      updatedBillingProduct.info.should.equal('This is the updated billingProduct!!!');
    });

    it('should respond with the updated billingProduct on a subsequent GET', function(done) {
      request(app)
        .get(`/api/billingProducts/${newBillingProduct._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let billingProduct = res.body;

          billingProduct.name.should.equal('Updated BillingProduct');
          billingProduct.info.should.equal('This is the updated billingProduct!!!');

          done();
        });
    });
  });

  describe('PATCH /api/billingProducts/:id', function() {
    var patchedBillingProduct;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/billingProducts/${newBillingProduct._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched BillingProduct' },
          { op: 'replace', path: '/info', value: 'This is the patched billingProduct!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBillingProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBillingProduct = {};
    });

    it('should respond with the patched billingProduct', function() {
      patchedBillingProduct.name.should.equal('Patched BillingProduct');
      patchedBillingProduct.info.should.equal('This is the patched billingProduct!!!');
    });
  });

  describe('DELETE /api/billingProducts/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/billingProducts/${newBillingProduct._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when billingProduct does not exist', function(done) {
      request(app)
        .delete(`/api/billingProducts/${newBillingProduct._id}`)
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
