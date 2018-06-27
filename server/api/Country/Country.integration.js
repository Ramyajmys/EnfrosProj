'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCountry;

describe('Country API:', function() {
  describe('GET /api/Countrys', function() {
    var Countrys;

    beforeEach(function(done) {
      request(app)
        .get('/api/Countrys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Countrys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Countrys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/Countrys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Countrys')
        .send({
          name: 'New Country',
          info: 'This is the brand new Country!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCountry = res.body;
          done();
        });
    });

    it('should respond with the newly created Country', function() {
      newCountry.name.should.equal('New Country');
      newCountry.info.should.equal('This is the brand new Country!!!');
    });
  });

  describe('GET /api/Countrys/:id', function() {
    var Country;

    beforeEach(function(done) {
      request(app)
        .get(`/api/Countrys/${newCountry._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Country = res.body;
          done();
        });
    });

    afterEach(function() {
      Country = {};
    });

    it('should respond with the requested Country', function() {
      Country.name.should.equal('New Country');
      Country.info.should.equal('This is the brand new Country!!!');
    });
  });

  describe('PUT /api/Countrys/:id', function() {
    var updatedCountry;

    beforeEach(function(done) {
      request(app)
        .put(`/api/Countrys/${newCountry._id}`)
        .send({
          name: 'Updated Country',
          info: 'This is the updated Country!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCountry = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCountry = {};
    });

    it('should respond with the updated Country', function() {
      updatedCountry.name.should.equal('Updated Country');
      updatedCountry.info.should.equal('This is the updated Country!!!');
    });

    it('should respond with the updated Country on a subsequent GET', function(done) {
      request(app)
        .get(`/api/Countrys/${newCountry._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Country = res.body;

          Country.name.should.equal('Updated Country');
          Country.info.should.equal('This is the updated Country!!!');

          done();
        });
    });
  });

  describe('PATCH /api/Countrys/:id', function() {
    var patchedCountry;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/Countrys/${newCountry._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Country' },
          { op: 'replace', path: '/info', value: 'This is the patched Country!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCountry = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCountry = {};
    });

    it('should respond with the patched Country', function() {
      patchedCountry.name.should.equal('Patched Country');
      patchedCountry.info.should.equal('This is the patched Country!!!');
    });
  });

  describe('DELETE /api/Countrys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/Countrys/${newCountry._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Country does not exist', function(done) {
      request(app)
        .delete(`/api/Countrys/${newCountry._id}`)
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
