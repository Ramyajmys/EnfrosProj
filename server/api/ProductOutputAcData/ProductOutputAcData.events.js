/**
 * ProductOutputAcData model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductOutputAcData = require('../../sqldb').ProductOutputAcData;
var ProductOutputAcDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductOutputAcDataEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductOutputAcData) {
  for(var e in events) {
    let event = events[e];
    ProductOutputAcData.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductOutputAcDataEvents.emit(event + ':' + doc._id, doc);
    ProductOutputAcDataEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductOutputAcData);
export default ProductOutputAcDataEvents;
