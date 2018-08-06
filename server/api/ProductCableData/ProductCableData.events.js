/**
 * ProductCableData model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductCableData = require('../../sqldb').ProductCableData;
var ProductCableDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductCableDataEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductCableData) {
  for(var e in events) {
    let event = events[e];
    ProductCableData.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductCableDataEvents.emit(event + ':' + doc._id, doc);
    ProductCableDataEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductCableData);
export default ProductCableDataEvents;
