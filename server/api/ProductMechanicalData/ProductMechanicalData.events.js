/**
 * ProductMechanicalData model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductMechanicalData = require('../../sqldb').ProductMechanicalData;
var ProductMechanicalDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductMechanicalDataEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductMechanicalData) {
  for(var e in events) {
    let event = events[e];
    ProductMechanicalData.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductMechanicalDataEvents.emit(event + ':' + doc._id, doc);
    ProductMechanicalDataEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductMechanicalData);
export default ProductMechanicalDataEvents;
