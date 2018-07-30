'use strict';

var express = require('express');
var controller = require('./UserProfile.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.post('/getUserInfo', controller.getUserInfo);
router.post('/getusers', controller.getusers);
router.post('/checkGst', controller.checkGst);

module.exports = router;
