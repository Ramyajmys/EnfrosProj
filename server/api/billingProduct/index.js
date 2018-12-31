'use strict';

var express = require('express');
var controller = require('./billingProduct.controller');

var router = express.Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

router.post('/getAllBill', controller.getAllBill);
router.post('/getAllCount', controller.getAllCount);
module.exports = router;
