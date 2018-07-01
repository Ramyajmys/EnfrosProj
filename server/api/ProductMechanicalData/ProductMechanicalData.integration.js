'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductMechanicalData;

describe('ProductMechanicalData API:', function() {
  describe('GET /api/ProductMechanicalDatas', function() {
    var ProductMechanicalDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductMechanicalDatas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductMechanicalDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductMechanicalDatas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductMechanicalDatas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductMechanicalDatas')
        .send({
          name: 'New ProductMechanicalData',
          info: 'This is the brand new ProductMechanicalData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductMechanicalData = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductMechanicalData', function() {
      newProductMechanicalData.name.should.equal('New ProductMechanicalData');
      newProductMechanicalData.info.should.equal('This is the brand new ProductMechanicalData!!!');
    });
  });

  describe('GET /api/ProductMechanicalDatas/:id', function() {
    var ProductMechanicalData;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductMechanicalDatas/${newProductMechanicalData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductMechanicalData = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductMechanicalData = {};
    });

    it('should respond with the requested ProductMechanicalData', function() {
      ProductMechanicalData.name.should.equal('New ProductMechanicalData');
      ProductMechanicalData.info.should.equal('This is the brand new ProductMechanicalData!!!');
    });
  });

  describe('PUT /api/ProductMechanicalDatas/:id', function() {
    var updatedProductMechanicalData;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductMechanicalDatas/${newProductMechanicalData._id}`)
        .send({
          name: 'Updated ProductMechanicalData',
          info: 'This is the updated ProductMechanicalData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductMechanicalData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductMechanicalData = {};
    });

    it('should respond with the updated ProductMechanicalData', function() {
      updatedProductMechanicalData.name.should.equal('Updated ProductMechanicalData');
      updatedProductMechanicalData.info.should.equal('This is the updated ProductMechanicalData!!!');
    });

    it('should respond with the updated ProductMechanicalData on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductMechanicalDatas/${newProductMechanicalData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductMechanicalData = res.body;

          ProductMechanicalData.name.should.equal('Updated ProductMechanicalData');
          ProductMechanicalData.info.should.equal('This is the updated ProductMechanicalData!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductMechanicalDatas/:id', function() {
    var patchedProductMechanicalData;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductMechanicalDatas/${newProductMechanicalData._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductMechanicalData' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductMechanicalData!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductMechanicalData = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductMechanicalData = {};
    });

    it('should respond with the patched ProductMechanicalData', function() {
      patchedProductMechanicalData.name.should.equal('Patched ProductMechanicalData');
      patchedProductMechanicalData.info.should.equal('This is the patched ProductMechanicalData!!!');
    });
  });

  describe('DELETE /api/ProductMechanicalDatas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductMechanicalDatas/${newProductMechanicalData._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductMechanicalData does not exist', function(done) {
      request(app)
        .delete(`/api/ProductMechanicalDatas/${newProductMechanicalData._id}`)
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
