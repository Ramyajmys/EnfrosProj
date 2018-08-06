'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductBatteryData;

describe('ProductBatteryData API:', function() {
  describe('GET /api/ProductBatteryDatas', function() {
    var ProductBatteryDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductBatteryDatas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductBatteryDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductBatteryDatas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductBatteryDatas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductBatteryDatas')
        .send({
          name: 'New ProductBatteryData',
          info: 'This is the brand new ProductBatteryData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductBatteryData = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductBatteryData', function() {
      newProductBatteryData.name.should.equal('New ProductBatteryData');
      newProductBatteryData.info.should.equal('This is the brand new ProductBatteryData!!!');
    });
  });

  describe('GET /api/ProductBatteryDatas/:id', function() {
    var ProductBatteryData;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductBatteryDatas/${newProductBatteryData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductBatteryData = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductBatteryData = {};
    });

    it('should respond with the requested ProductBatteryData', function() {
      ProductBatteryData.name.should.equal('New ProductBatteryData');
      ProductBatteryData.info.should.equal('This is the brand new ProductBatteryData!!!');
    });
  });

  describe('PUT /api/ProductBatteryDatas/:id', function() {
    var updatedProductBatteryData;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductBatteryDatas/${newProductBatteryData._id}`)
        .send({
          name: 'Updated ProductBatteryData',
          info: 'This is the updated ProductBatteryData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductBatteryData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductBatteryData = {};
    });

    it('should respond with the updated ProductBatteryData', function() {
      updatedProductBatteryData.name.should.equal('Updated ProductBatteryData');
      updatedProductBatteryData.info.should.equal('This is the updated ProductBatteryData!!!');
    });

    it('should respond with the updated ProductBatteryData on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductBatteryDatas/${newProductBatteryData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductBatteryData = res.body;

          ProductBatteryData.name.should.equal('Updated ProductBatteryData');
          ProductBatteryData.info.should.equal('This is the updated ProductBatteryData!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductBatteryDatas/:id', function() {
    var patchedProductBatteryData;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductBatteryDatas/${newProductBatteryData._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductBatteryData' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductBatteryData!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductBatteryData = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductBatteryData = {};
    });

    it('should respond with the patched ProductBatteryData', function() {
      patchedProductBatteryData.name.should.equal('Patched ProductBatteryData');
      patchedProductBatteryData.info.should.equal('This is the patched ProductBatteryData!!!');
    });
  });

  describe('DELETE /api/ProductBatteryDatas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductBatteryDatas/${newProductBatteryData._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductBatteryData does not exist', function(done) {
      request(app)
        .delete(`/api/ProductBatteryDatas/${newProductBatteryData._id}`)
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
