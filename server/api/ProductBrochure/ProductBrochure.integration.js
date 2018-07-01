'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductBrochure;

describe('ProductBrochure API:', function() {
  describe('GET /api/ProductBrochures', function() {
    var ProductBrochures;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductBrochures')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductBrochures = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductBrochures.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductBrochures', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductBrochures')
        .send({
          name: 'New ProductBrochure',
          info: 'This is the brand new ProductBrochure!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductBrochure = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductBrochure', function() {
      newProductBrochure.name.should.equal('New ProductBrochure');
      newProductBrochure.info.should.equal('This is the brand new ProductBrochure!!!');
    });
  });

  describe('GET /api/ProductBrochures/:id', function() {
    var ProductBrochure;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductBrochures/${newProductBrochure._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductBrochure = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductBrochure = {};
    });

    it('should respond with the requested ProductBrochure', function() {
      ProductBrochure.name.should.equal('New ProductBrochure');
      ProductBrochure.info.should.equal('This is the brand new ProductBrochure!!!');
    });
  });

  describe('PUT /api/ProductBrochures/:id', function() {
    var updatedProductBrochure;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductBrochures/${newProductBrochure._id}`)
        .send({
          name: 'Updated ProductBrochure',
          info: 'This is the updated ProductBrochure!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductBrochure = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductBrochure = {};
    });

    it('should respond with the updated ProductBrochure', function() {
      updatedProductBrochure.name.should.equal('Updated ProductBrochure');
      updatedProductBrochure.info.should.equal('This is the updated ProductBrochure!!!');
    });

    it('should respond with the updated ProductBrochure on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductBrochures/${newProductBrochure._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductBrochure = res.body;

          ProductBrochure.name.should.equal('Updated ProductBrochure');
          ProductBrochure.info.should.equal('This is the updated ProductBrochure!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductBrochures/:id', function() {
    var patchedProductBrochure;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductBrochures/${newProductBrochure._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductBrochure' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductBrochure!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductBrochure = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductBrochure = {};
    });

    it('should respond with the patched ProductBrochure', function() {
      patchedProductBrochure.name.should.equal('Patched ProductBrochure');
      patchedProductBrochure.info.should.equal('This is the patched ProductBrochure!!!');
    });
  });

  describe('DELETE /api/ProductBrochures/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductBrochures/${newProductBrochure._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductBrochure does not exist', function(done) {
      request(app)
        .delete(`/api/ProductBrochures/${newProductBrochure._id}`)
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
