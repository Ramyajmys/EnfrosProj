'use strict';

var express = require('express');
var controller = require('./quotation.controller');

var router = express.Router();

// router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/getAllQuotes', controller.getAllQuotes);
router.post('/getAllQuoteCount', controller.getAllQuoteCount);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);
router.post('/sendContactInfo', controller.sendContactInfo);
module.exports = router;
