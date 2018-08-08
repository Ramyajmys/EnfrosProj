'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductOutputAcData;

describe('ProductOutputAcData API:', function() {
  describe('GET /api/ProductOutputAcDatas', function() {
    var ProductOutputAcDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductOutputAcDatas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductOutputAcDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductOutputAcDatas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductOutputAcDatas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductOutputAcDatas')
        .send({
          name: 'New ProductOutputAcData',
          info: 'This is the brand new ProductOutputAcData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductOutputAcData = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductOutputAcData', function() {
      newProductOutputAcData.name.should.equal('New ProductOutputAcData');
      newProductOutputAcData.info.should.equal('This is the brand new ProductOutputAcData!!!');
    });
  });

  describe('GET /api/ProductOutputAcDatas/:id', function() {
    var ProductOutputAcData;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductOutputAcDatas/${newProductOutputAcData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductOutputAcData = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductOutputAcData = {};
    });

    it('should respond with the requested ProductOutputAcData', function() {
      ProductOutputAcData.name.should.equal('New ProductOutputAcData');
      ProductOutputAcData.info.should.equal('This is the brand new ProductOutputAcData!!!');
    });
  });

  describe('PUT /api/ProductOutputAcDatas/:id', function() {
    var updatedProductOutputAcData;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductOutputAcDatas/${newProductOutputAcData._id}`)
        .send({
          name: 'Updated ProductOutputAcData',
          info: 'This is the updated ProductOutputAcData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductOutputAcData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductOutputAcData = {};
    });

    it('should respond with the updated ProductOutputAcData', function() {
      updatedProductOutputAcData.name.should.equal('Updated ProductOutputAcData');
      updatedProductOutputAcData.info.should.equal('This is the updated ProductOutputAcData!!!');
    });

    it('should respond with the updated ProductOutputAcData on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductOutputAcDatas/${newProductOutputAcData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductOutputAcData = res.body;

          ProductOutputAcData.name.should.equal('Updated ProductOutputAcData');
          ProductOutputAcData.info.should.equal('This is the updated ProductOutputAcData!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductOutputAcDatas/:id', function() {
    var patchedProductOutputAcData;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductOutputAcDatas/${newProductOutputAcData._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductOutputAcData' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductOutputAcData!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductOutputAcData = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductOutputAcData = {};
    });

    it('should respond with the patched ProductOutputAcData', function() {
      patchedProductOutputAcData.name.should.equal('Patched ProductOutputAcData');
      patchedProductOutputAcData.info.should.equal('This is the patched ProductOutputAcData!!!');
    });
  });

  describe('DELETE /api/ProductOutputAcDatas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductOutputAcDatas/${newProductOutputAcData._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductOutputAcData does not exist', function(done) {
      request(app)
        .delete(`/api/ProductOutputAcDatas/${newProductOutputAcData._id}`)
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
