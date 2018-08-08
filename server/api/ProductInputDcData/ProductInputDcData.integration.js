'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductInputDcData;

describe('ProductInputDcData API:', function() {
  describe('GET /api/ProductInputDcDatas', function() {
    var ProductInputDcDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductInputDcDatas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductInputDcDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductInputDcDatas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductInputDcDatas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductInputDcDatas')
        .send({
          name: 'New ProductInputDcData',
          info: 'This is the brand new ProductInputDcData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductInputDcData = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductInputDcData', function() {
      newProductInputDcData.name.should.equal('New ProductInputDcData');
      newProductInputDcData.info.should.equal('This is the brand new ProductInputDcData!!!');
    });
  });

  describe('GET /api/ProductInputDcDatas/:id', function() {
    var ProductInputDcData;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductInputDcDatas/${newProductInputDcData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductInputDcData = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductInputDcData = {};
    });

    it('should respond with the requested ProductInputDcData', function() {
      ProductInputDcData.name.should.equal('New ProductInputDcData');
      ProductInputDcData.info.should.equal('This is the brand new ProductInputDcData!!!');
    });
  });

  describe('PUT /api/ProductInputDcDatas/:id', function() {
    var updatedProductInputDcData;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductInputDcDatas/${newProductInputDcData._id}`)
        .send({
          name: 'Updated ProductInputDcData',
          info: 'This is the updated ProductInputDcData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductInputDcData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductInputDcData = {};
    });

    it('should respond with the updated ProductInputDcData', function() {
      updatedProductInputDcData.name.should.equal('Updated ProductInputDcData');
      updatedProductInputDcData.info.should.equal('This is the updated ProductInputDcData!!!');
    });

    it('should respond with the updated ProductInputDcData on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductInputDcDatas/${newProductInputDcData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductInputDcData = res.body;

          ProductInputDcData.name.should.equal('Updated ProductInputDcData');
          ProductInputDcData.info.should.equal('This is the updated ProductInputDcData!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductInputDcDatas/:id', function() {
    var patchedProductInputDcData;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductInputDcDatas/${newProductInputDcData._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductInputDcData' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductInputDcData!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductInputDcData = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductInputDcData = {};
    });

    it('should respond with the patched ProductInputDcData', function() {
      patchedProductInputDcData.name.should.equal('Patched ProductInputDcData');
      patchedProductInputDcData.info.should.equal('This is the patched ProductInputDcData!!!');
    });
  });

  describe('DELETE /api/ProductInputDcDatas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductInputDcDatas/${newProductInputDcData._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductInputDcData does not exist', function(done) {
      request(app)
        .delete(`/api/ProductInputDcDatas/${newProductInputDcData._id}`)
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
