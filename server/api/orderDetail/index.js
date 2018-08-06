'use strict';

var express = require('express');
var controller = require('./orderDetail.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.post('/getdetails', controller.getdetails);

router.post('/sendEmail', controller.sendEmail);
router.post('/sendSMS', controller.sendSMS);
module.exports = router;
