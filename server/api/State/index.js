'use strict';

var express = require('express');
var controller = require('./State.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

router.post('/getAllState', controller.getAllState);
router.post('/getAllCount', controller.getAllCount);
router.post('/getcList', controller.getcList);

module.exports = router;
