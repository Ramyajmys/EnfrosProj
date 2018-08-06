'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductKitsData;

describe('ProductKitsData API:', function() {
  describe('GET /api/ProductKitsDatas', function() {
    var ProductKitsDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductKitsDatas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductKitsDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductKitsDatas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductKitsDatas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductKitsDatas')
        .send({
          name: 'New ProductKitsData',
          info: 'This is the brand new ProductKitsData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductKitsData = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductKitsData', function() {
      newProductKitsData.name.should.equal('New ProductKitsData');
      newProductKitsData.info.should.equal('This is the brand new ProductKitsData!!!');
    });
  });

  describe('GET /api/ProductKitsDatas/:id', function() {
    var ProductKitsData;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductKitsDatas/${newProductKitsData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductKitsData = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductKitsData = {};
    });

    it('should respond with the requested ProductKitsData', function() {
      ProductKitsData.name.should.equal('New ProductKitsData');
      ProductKitsData.info.should.equal('This is the brand new ProductKitsData!!!');
    });
  });

  describe('PUT /api/ProductKitsDatas/:id', function() {
    var updatedProductKitsData;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductKitsDatas/${newProductKitsData._id}`)
        .send({
          name: 'Updated ProductKitsData',
          info: 'This is the updated ProductKitsData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductKitsData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductKitsData = {};
    });

    it('should respond with the updated ProductKitsData', function() {
      updatedProductKitsData.name.should.equal('Updated ProductKitsData');
      updatedProductKitsData.info.should.equal('This is the updated ProductKitsData!!!');
    });

    it('should respond with the updated ProductKitsData on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductKitsDatas/${newProductKitsData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductKitsData = res.body;

          ProductKitsData.name.should.equal('Updated ProductKitsData');
          ProductKitsData.info.should.equal('This is the updated ProductKitsData!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductKitsDatas/:id', function() {
    var patchedProductKitsData;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductKitsDatas/${newProductKitsData._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductKitsData' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductKitsData!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductKitsData = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductKitsData = {};
    });

    it('should respond with the patched ProductKitsData', function() {
      patchedProductKitsData.name.should.equal('Patched ProductKitsData');
      patchedProductKitsData.info.should.equal('This is the patched ProductKitsData!!!');
    });
  });

  describe('DELETE /api/ProductKitsDatas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductKitsDatas/${newProductKitsData._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductKitsData does not exist', function(done) {
      request(app)
        .delete(`/api/ProductKitsDatas/${newProductKitsData._id}`)
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
