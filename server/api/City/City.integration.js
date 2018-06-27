'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCity;

describe('City API:', function() {
  describe('GET /api/Citys', function() {
    var Citys;

    beforeEach(function(done) {
      request(app)
        .get('/api/Citys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Citys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Citys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/Citys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Citys')
        .send({
          name: 'New City',
          info: 'This is the brand new City!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCity = res.body;
          done();
        });
    });

    it('should respond with the newly created City', function() {
      newCity.name.should.equal('New City');
      newCity.info.should.equal('This is the brand new City!!!');
    });
  });

  describe('GET /api/Citys/:id', function() {
    var City;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Citys/${newCity._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          City = res.body;
          done();
        });
    });

    afterEach(function() {
      City = {};
    });

    it('should respond with the requested City', function() {
      City.name.should.equal('New City');
      City.info.should.equal('This is the brand new City!!!');
    });
  });

  describe('PUT /api/Citys/:id', function() {
    var updatedCity;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Citys/${newCity._id}`)
        .send({
          name: 'Updated City',
          info: 'This is the updated City!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCity = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCity = {};
    });

    it('should respond with the updated City', function() {
      updatedCity.name.should.equal('Updated City');
      updatedCity.info.should.equal('This is the updated City!!!');
    });

    it('should respond with the updated City on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Citys/${newCity._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let City = res.body;

          City.name.should.equal('Updated City');
          City.info.should.equal('This is the updated City!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Citys/:id', function() {
    var patchedCity;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Citys/${newCity._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched City' },
          { op: 'replace', path: '/info', value: 'This is the patched City!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCity = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCity = {};
    });

    it('should respond with the patched City', function() {
      patchedCity.name.should.equal('Patched City');
      patchedCity.info.should.equal('This is the patched City!!!');
    });
  });

  describe('DELETE /api/Citys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Citys/${newCity._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when City does not exist', function(done) {
      request(app)
        .delete(`/api/Citys/${newCity._id}`)
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
