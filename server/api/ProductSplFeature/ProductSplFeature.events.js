/**
 * ProductSplFeature model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductSplFeature = require('../../sqldb').ProductSplFeature;
var ProductSplFeatureEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductSplFeatureEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductSplFeature) {
  for(var e in events) {
    let event = events[e];
    ProductSplFeature.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductSplFeatureEvents.emit(event + ':' + doc._id, doc);
    ProductSplFeatureEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductSplFeature);
export default ProductSplFeatureEvents;
