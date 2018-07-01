'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductKeyNote;

describe('ProductKeyNote API:', function() {
  describe('GET /api/ProductKeyNotes', function() {
    var ProductKeyNotes;

    beforeEach(function(done) {
      request(app)
        .get('/api/ProductKeyNotes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductKeyNotes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ProductKeyNotes.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ProductKeyNotes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ProductKeyNotes')
        .send({
          name: 'New ProductKeyNote',
          info: 'This is the brand new ProductKeyNote!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductKeyNote = res.body;
          done();
        });
    });

    it('should respond with the newly created ProductKeyNote', function() {
      newProductKeyNote.name.should.equal('New ProductKeyNote');
      newProductKeyNote.info.should.equal('This is the brand new ProductKeyNote!!!');
    });
  });

  describe('GET /api/ProductKeyNotes/:id', function() {
    var ProductKeyNote;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ProductKeyNotes/${newProductKeyNote._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ProductKeyNote = res.body;
          done();
        });
    });

    afterEach(function() {
      ProductKeyNote = {};
    });

    it('should respond with the requested ProductKeyNote', function() {
      ProductKeyNote.name.should.equal('New ProductKeyNote');
      ProductKeyNote.info.should.equal('This is the brand new ProductKeyNote!!!');
    });
  });

  describe('PUT /api/ProductKeyNotes/:id', function() {
    var updatedProductKeyNote;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ProductKeyNotes/${newProductKeyNote._id}`)
        .send({
          name: 'Updated ProductKeyNote',
          info: 'This is the updated ProductKeyNote!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductKeyNote = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductKeyNote = {};
    });

    it('should respond with the updated ProductKeyNote', function() {
      updatedProductKeyNote.name.should.equal('Updated ProductKeyNote');
      updatedProductKeyNote.info.should.equal('This is the updated ProductKeyNote!!!');
    });

    it('should respond with the updated ProductKeyNote on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ProductKeyNotes/${newProductKeyNote._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ProductKeyNote = res.body;

          ProductKeyNote.name.should.equal('Updated ProductKeyNote');
          ProductKeyNote.info.should.equal('This is the updated ProductKeyNote!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ProductKeyNotes/:id', function() {
    var patchedProductKeyNote;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ProductKeyNotes/${newProductKeyNote._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductKeyNote' },
          { op: 'replace', path: '/info', value: 'This is the patched ProductKeyNote!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductKeyNote = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductKeyNote = {};
    });

    it('should respond with the patched ProductKeyNote', function() {
      patchedProductKeyNote.name.should.equal('Patched ProductKeyNote');
      patchedProductKeyNote.info.should.equal('This is the patched ProductKeyNote!!!');
    });
  });

  describe('DELETE /api/ProductKeyNotes/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ProductKeyNotes/${newProductKeyNote._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ProductKeyNote does not exist', function(done) {
      request(app)
        .delete(`/api/ProductKeyNotes/${newProductKeyNote._id}`)
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
