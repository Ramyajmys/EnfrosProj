'use strict';

var express = require('express');
var controller = require('./ProductDetail.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/update', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.post('/getproductPagecategory', controller.getProductCategory);
router.post('/getproductdetails', controller.getproductdetails);
router.post('/getProductsubCategory', controller.getProductsubCategory);

module.exports = router;
