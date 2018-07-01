'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductDetail;

describe('ProductDetail API:', function() {
  describe('GET /api/ProductDetails', function() {
    var ProductDetails;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductDetails')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductDetails = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductDetails.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductDetails', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductDetails')
        .send({
          name: 'New ProductDetail',
          info: 'This is the brand new ProductDetail!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductDetail = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductDetail', function() {
      newProductDetail.name.should.equal('New ProductDetail');
      newProductDetail.info.should.equal('This is the brand new ProductDetail!!!');
    });
  });

  describe('GET /api/ProductDetails/:id', function() {
    var ProductDetail;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductDetails/${newProductDetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductDetail = {};
    });

    it('should respond with the requested ProductDetail', function() {
      ProductDetail.name.should.equal('New ProductDetail');
      ProductDetail.info.should.equal('This is the brand new ProductDetail!!!');
    });
  });

  describe('PUT /api/ProductDetails/:id', function() {
    var updatedProductDetail;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductDetails/${newProductDetail._id}`)
        .send({
          name: 'Updated ProductDetail',
          info: 'This is the updated ProductDetail!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductDetail = {};
    });

    it('should respond with the updated ProductDetail', function() {
      updatedProductDetail.name.should.equal('Updated ProductDetail');
      updatedProductDetail.info.should.equal('This is the updated ProductDetail!!!');
    });

    it('should respond with the updated ProductDetail on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductDetails/${newProductDetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductDetail = res.body;

          ProductDetail.name.should.equal('Updated ProductDetail');
          ProductDetail.info.should.equal('This is the updated ProductDetail!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductDetails/:id', function() {
    var patchedProductDetail;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductDetails/${newProductDetail._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductDetail' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductDetail!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductDetail = {};
    });

    it('should respond with the patched ProductDetail', function() {
      patchedProductDetail.name.should.equal('Patched ProductDetail');
      patchedProductDetail.info.should.equal('This is the patched ProductDetail!!!');
    });
  });

  describe('DELETE /api/ProductDetails/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductDetails/${newProductDetail._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductDetail does not exist', function(done) {
      request(app)
        .delete(`/api/ProductDetails/${newProductDetail._id}`)
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
