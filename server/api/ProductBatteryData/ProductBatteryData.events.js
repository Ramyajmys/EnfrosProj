/**
 * ProductBatteryData model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductBatteryData = require('../../sqldb').ProductBatteryData;
var ProductBatteryDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductBatteryDataEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductBatteryData) {
  for(var e in events) {
    let event = events[e];
    ProductBatteryData.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductBatteryDataEvents.emit(event + ':' + doc._id, doc);
    ProductBatteryDataEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductBatteryData);
export default ProductBatteryDataEvents;
