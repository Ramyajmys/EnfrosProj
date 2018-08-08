/**
 * ProductInputDcData model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductInputDcData = require('../../sqldb').ProductInputDcData;
var ProductInputDcDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductInputDcDataEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductInputDcData) {
  for(var e in events) {
    let event = events[e];
    ProductInputDcData.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductInputDcDataEvents.emit(event + ':' + doc._id, doc);
    ProductInputDcDataEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductInputDcData);
export default ProductInputDcDataEvents;
