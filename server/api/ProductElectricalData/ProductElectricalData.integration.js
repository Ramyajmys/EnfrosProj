'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductElectricalData;

describe('ProductElectricalData API:', function() {
  describe('GET /api/ProductElectricalDatas', function() {
    var ProductElectricalDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductElectricalDatas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductElectricalDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductElectricalDatas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductElectricalDatas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductElectricalDatas')
        .send({
          name: 'New ProductElectricalData',
          info: 'This is the brand new ProductElectricalData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductElectricalData = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductElectricalData', function() {
      newProductElectricalData.name.should.equal('New ProductElectricalData');
      newProductElectricalData.info.should.equal('This is the brand new ProductElectricalData!!!');
    });
  });

  describe('GET /api/ProductElectricalDatas/:id', function() {
    var ProductElectricalData;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductElectricalDatas/${newProductElectricalData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductElectricalData = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductElectricalData = {};
    });

    it('should respond with the requested ProductElectricalData', function() {
      ProductElectricalData.name.should.equal('New ProductElectricalData');
      ProductElectricalData.info.should.equal('This is the brand new ProductElectricalData!!!');
    });
  });

  describe('PUT /api/ProductElectricalDatas/:id', function() {
    var updatedProductElectricalData;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductElectricalDatas/${newProductElectricalData._id}`)
        .send({
          name: 'Updated ProductElectricalData',
          info: 'This is the updated ProductElectricalData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductElectricalData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductElectricalData = {};
    });

    it('should respond with the updated ProductElectricalData', function() {
      updatedProductElectricalData.name.should.equal('Updated ProductElectricalData');
      updatedProductElectricalData.info.should.equal('This is the updated ProductElectricalData!!!');
    });

    it('should respond with the updated ProductElectricalData on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductElectricalDatas/${newProductElectricalData._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductElectricalData = res.body;

          ProductElectricalData.name.should.equal('Updated ProductElectricalData');
          ProductElectricalData.info.should.equal('This is the updated ProductElectricalData!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductElectricalDatas/:id', function() {
    var patchedProductElectricalData;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductElectricalDatas/${newProductElectricalData._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductElectricalData' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductElectricalData!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductElectricalData = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductElectricalData = {};
    });

    it('should respond with the patched ProductElectricalData', function() {
      patchedProductElectricalData.name.should.equal('Patched ProductElectricalData');
      patchedProductElectricalData.info.should.equal('This is the patched ProductElectricalData!!!');
    });
  });

  describe('DELETE /api/ProductElectricalDatas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductElectricalDatas/${newProductElectricalData._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductElectricalData does not exist', function(done) {
      request(app)
        .delete(`/api/ProductElectricalDatas/${newProductElectricalData._id}`)
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
