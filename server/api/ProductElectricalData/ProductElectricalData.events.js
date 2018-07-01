/**
 * ProductElectricalData model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductElectricalData = require('../../sqldb').ProductElectricalData;
var ProductElectricalDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductElectricalDataEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductElectricalData) {
  for(var e in events) {
    let event = events[e];
    ProductElectricalData.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductElectricalDataEvents.emit(event + ':' + doc._id, doc);
    ProductElectricalDataEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductElectricalData);
export default ProductElectricalDataEvents;
