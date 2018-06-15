'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductSubCategory;

describe('ProductSubCategory API:', function() {
  describe('GET /api/ProductSubCategorys', function() {
    var ProductSubCategorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductSubCategorys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductSubCategorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductSubCategorys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductSubCategorys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductSubCategorys')
        .send({
          name: 'New ProductSubCategory',
          info: 'This is the brand new ProductSubCategory!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductSubCategory = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductSubCategory', function() {
      newProductSubCategory.name.should.equal('New ProductSubCategory');
      newProductSubCategory.info.should.equal('This is the brand new ProductSubCategory!!!');
    });
  });

  describe('GET /api/ProductSubCategorys/:id', function() {
    var ProductSubCategory;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductSubCategorys/${newProductSubCategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductSubCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductSubCategory = {};
    });

    it('should respond with the requested ProductSubCategory', function() {
      ProductSubCategory.name.should.equal('New ProductSubCategory');
      ProductSubCategory.info.should.equal('This is the brand new ProductSubCategory!!!');
    });
  });

  describe('PUT /api/ProductSubCategorys/:id', function() {
    var updatedProductSubCategory;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductSubCategorys/${newProductSubCategory._id}`)
        .send({
          name: 'Updated ProductSubCategory',
          info: 'This is the updated ProductSubCategory!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductSubCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductSubCategory = {};
    });

    it('should respond with the updated ProductSubCategory', function() {
      updatedProductSubCategory.name.should.equal('Updated ProductSubCategory');
      updatedProductSubCategory.info.should.equal('This is the updated ProductSubCategory!!!');
    });

    it('should respond with the updated ProductSubCategory on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductSubCategorys/${newProductSubCategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductSubCategory = res.body;

          ProductSubCategory.name.should.equal('Updated ProductSubCategory');
          ProductSubCategory.info.should.equal('This is the updated ProductSubCategory!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductSubCategorys/:id', function() {
    var patchedProductSubCategory;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductSubCategorys/${newProductSubCategory._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductSubCategory' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductSubCategory!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductSubCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductSubCategory = {};
    });

    it('should respond with the patched ProductSubCategory', function() {
      patchedProductSubCategory.name.should.equal('Patched ProductSubCategory');
      patchedProductSubCategory.info.should.equal('This is the patched ProductSubCategory!!!');
    });
  });

  describe('DELETE /api/ProductSubCategorys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductSubCategorys/${newProductSubCategory._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductSubCategory does not exist', function(done) {
      request(app)
        .delete(`/api/ProductSubCategorys/${newProductSubCategory._id}`)
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
