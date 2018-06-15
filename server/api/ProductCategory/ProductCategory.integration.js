'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductCategory;

describe('ProductCategory API:', function() {
  describe('GET /api/ProductCategorys', function() {
    var ProductCategorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductCategorys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductCategorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductCategorys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductCategorys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductCategorys')
        .send({
          name: 'New ProductCategory',
          info: 'This is the brand new ProductCategory!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductCategory = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductCategory', function() {
      newProductCategory.name.should.equal('New ProductCategory');
      newProductCategory.info.should.equal('This is the brand new ProductCategory!!!');
    });
  });

  describe('GET /api/ProductCategorys/:id', function() {
    var ProductCategory;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductCategorys/${newProductCategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductCategory = {};
    });

    it('should respond with the requested ProductCategory', function() {
      ProductCategory.name.should.equal('New ProductCategory');
      ProductCategory.info.should.equal('This is the brand new ProductCategory!!!');
    });
  });

  describe('PUT /api/ProductCategorys/:id', function() {
    var updatedProductCategory;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductCategorys/${newProductCategory._id}`)
        .send({
          name: 'Updated ProductCategory',
          info: 'This is the updated ProductCategory!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductCategory = {};
    });

    it('should respond with the updated ProductCategory', function() {
      updatedProductCategory.name.should.equal('Updated ProductCategory');
      updatedProductCategory.info.should.equal('This is the updated ProductCategory!!!');
    });

    it('should respond with the updated ProductCategory on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductCategorys/${newProductCategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductCategory = res.body;

          ProductCategory.name.should.equal('Updated ProductCategory');
          ProductCategory.info.should.equal('This is the updated ProductCategory!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductCategorys/:id', function() {
    var patchedProductCategory;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductCategorys/${newProductCategory._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductCategory' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductCategory!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductCategory = {};
    });

    it('should respond with the patched ProductCategory', function() {
      patchedProductCategory.name.should.equal('Patched ProductCategory');
      patchedProductCategory.info.should.equal('This is the patched ProductCategory!!!');
    });
  });

  describe('DELETE /api/ProductCategorys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductCategorys/${newProductCategory._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductCategory does not exist', function(done) {
      request(app)
        .delete(`/api/ProductCategorys/${newProductCategory._id}`)
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
