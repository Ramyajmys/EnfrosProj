/**
 * ProductDetail model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductDetail = require('../../sqldb').ProductDetail;
var ProductDetailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductDetailEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductDetail) {
  for(var e in events) {
    let event = events[e];
    ProductDetail.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductDetailEvents.emit(event + ':' + doc._id, doc);
    ProductDetailEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductDetail);
export default ProductDetailEvents;
