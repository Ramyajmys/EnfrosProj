'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductCableData;

describe('ProductCableData API:', function() {
  describe('GET /api/ProductCableDatas', function() {
    var ProductCableDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductCableDatas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductCableDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductCableDatas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductCableDatas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductCableDatas')
        .send({
          name: 'New ProductCableData',
          info: 'This is the brand new ProductCableData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductCableData = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductCableData', function() {
      newProductCableData.name.should.equal('New ProductCableData');
      newProductCableData.info.should.equal('This is the brand new ProductCableData!!!');
    });
  });

  describe('GET /api/ProductCableDatas/:id', function() {
    var ProductCableData;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductCableDatas/${newProductCableData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductCableData = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductCableData = {};
    });

    it('should respond with the requested ProductCableData', function() {
      ProductCableData.name.should.equal('New ProductCableData');
      ProductCableData.info.should.equal('This is the brand new ProductCableData!!!');
    });
  });

  describe('PUT /api/ProductCableDatas/:id', function() {
    var updatedProductCableData;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductCableDatas/${newProductCableData._id}`)
        .send({
          name: 'Updated ProductCableData',
          info: 'This is the updated ProductCableData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductCableData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductCableData = {};
    });

    it('should respond with the updated ProductCableData', function() {
      updatedProductCableData.name.should.equal('Updated ProductCableData');
      updatedProductCableData.info.should.equal('This is the updated ProductCableData!!!');
    });

    it('should respond with the updated ProductCableData on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductCableDatas/${newProductCableData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductCableData = res.body;

          ProductCableData.name.should.equal('Updated ProductCableData');
          ProductCableData.info.should.equal('This is the updated ProductCableData!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductCableDatas/:id', function() {
    var patchedProductCableData;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductCableDatas/${newProductCableData._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductCableData' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductCableData!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductCableData = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductCableData = {};
    });

    it('should respond with the patched ProductCableData', function() {
      patchedProductCableData.name.should.equal('Patched ProductCableData');
      patchedProductCableData.info.should.equal('This is the patched ProductCableData!!!');
    });
  });

  describe('DELETE /api/ProductCableDatas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductCableDatas/${newProductCableData._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductCableData does not exist', function(done) {
      request(app)
        .delete(`/api/ProductCableDatas/${newProductCableData._id}`)
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
