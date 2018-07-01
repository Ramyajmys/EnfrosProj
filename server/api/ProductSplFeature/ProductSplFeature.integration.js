'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductSplFeature;

describe('ProductSplFeature API:', function() {
  describe('GET /api/ProductSplFeatures', function() {
    var ProductSplFeatures;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductSplFeatures')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductSplFeatures = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductSplFeatures.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductSplFeatures', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductSplFeatures')
        .send({
          name: 'New ProductSplFeature',
          info: 'This is the brand new ProductSplFeature!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductSplFeature = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductSplFeature', function() {
      newProductSplFeature.name.should.equal('New ProductSplFeature');
      newProductSplFeature.info.should.equal('This is the brand new ProductSplFeature!!!');
    });
  });

  describe('GET /api/ProductSplFeatures/:id', function() {
    var ProductSplFeature;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductSplFeatures/${newProductSplFeature._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductSplFeature = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductSplFeature = {};
    });

    it('should respond with the requested ProductSplFeature', function() {
      ProductSplFeature.name.should.equal('New ProductSplFeature');
      ProductSplFeature.info.should.equal('This is the brand new ProductSplFeature!!!');
    });
  });

  describe('PUT /api/ProductSplFeatures/:id', function() {
    var updatedProductSplFeature;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductSplFeatures/${newProductSplFeature._id}`)
        .send({
          name: 'Updated ProductSplFeature',
          info: 'This is the updated ProductSplFeature!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductSplFeature = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductSplFeature = {};
    });

    it('should respond with the updated ProductSplFeature', function() {
      updatedProductSplFeature.name.should.equal('Updated ProductSplFeature');
      updatedProductSplFeature.info.should.equal('This is the updated ProductSplFeature!!!');
    });

    it('should respond with the updated ProductSplFeature on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductSplFeatures/${newProductSplFeature._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductSplFeature = res.body;

          ProductSplFeature.name.should.equal('Updated ProductSplFeature');
          ProductSplFeature.info.should.equal('This is the updated ProductSplFeature!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductSplFeatures/:id', function() {
    var patchedProductSplFeature;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductSplFeatures/${newProductSplFeature._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductSplFeature' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductSplFeature!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductSplFeature = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductSplFeature = {};
    });

    it('should respond with the patched ProductSplFeature', function() {
      patchedProductSplFeature.name.should.equal('Patched ProductSplFeature');
      patchedProductSplFeature.info.should.equal('This is the patched ProductSplFeature!!!');
    });
  });

  describe('DELETE /api/ProductSplFeatures/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductSplFeatures/${newProductSplFeature._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductSplFeature does not exist', function(done) {
      request(app)
        .delete(`/api/ProductSplFeatures/${newProductSplFeature._id}`)
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
