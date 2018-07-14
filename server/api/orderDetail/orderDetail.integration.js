'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newOrderDetail;

describe('OrderDetail API:', function() {
  describe('GET /api/orderDetails', function() {
    var orderDetails;

    beforeEach(function(done) {
      request(app)
        .get('/api/orderDetails')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          orderDetails = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      orderDetails.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/orderDetails', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/orderDetails')
        .send({
          name: 'New OrderDetail',
          info: 'This is the brand new orderDetail!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newOrderDetail = res.body;
          done();
        });
    });

    it('should respond with the newly created orderDetail', function() {
      newOrderDetail.name.should.equal('New OrderDetail');
      newOrderDetail.info.should.equal('This is the brand new orderDetail!!!');
    });
  });

  describe('GET /api/orderDetails/:id', function() {
    var orderDetail;

    beforeEach(function(done) {
      request(app)
        .get(`/api/orderDetails/${newOrderDetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          orderDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      orderDetail = {};
    });

    it('should respond with the requested orderDetail', function() {
      orderDetail.name.should.equal('New OrderDetail');
      orderDetail.info.should.equal('This is the brand new orderDetail!!!');
    });
  });

  describe('PUT /api/orderDetails/:id', function() {
    var updatedOrderDetail;

    beforeEach(function(done) {
      request(app)
        .put(`/api/orderDetails/${newOrderDetail._id}`)
        .send({
          name: 'Updated OrderDetail',
          info: 'This is the updated orderDetail!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedOrderDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrderDetail = {};
    });

    it('should respond with the updated orderDetail', function() {
      updatedOrderDetail.name.should.equal('Updated OrderDetail');
      updatedOrderDetail.info.should.equal('This is the updated orderDetail!!!');
    });

    it('should respond with the updated orderDetail on a subsequent GET', function(done) {
      request(app)
        .get(`/api/orderDetails/${newOrderDetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let orderDetail = res.body;

          orderDetail.name.should.equal('Updated OrderDetail');
          orderDetail.info.should.equal('This is the updated orderDetail!!!');

          done();
        });
    });
  });

  describe('PATCH /api/orderDetails/:id', function() {
    var patchedOrderDetail;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/orderDetails/${newOrderDetail._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched OrderDetail' },
          { op: 'replace', path: '/info', value: 'This is the patched orderDetail!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedOrderDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedOrderDetail = {};
    });

    it('should respond with the patched orderDetail', function() {
      patchedOrderDetail.name.should.equal('Patched OrderDetail');
      patchedOrderDetail.info.should.equal('This is the patched orderDetail!!!');
    });
  });

  describe('DELETE /api/orderDetails/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/orderDetails/${newOrderDetail._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when orderDetail does not exist', function(done) {
      request(app)
        .delete(`/api/orderDetails/${newOrderDetail._id}`)
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
