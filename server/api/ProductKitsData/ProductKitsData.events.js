/**
 * ProductKitsData model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductKitsData = require('../../sqldb').ProductKitsData;
var ProductKitsDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductKitsDataEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductKitsData) {
  for(var e in events) {
    let event = events[e];
    ProductKitsData.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductKitsDataEvents.emit(event + ':' + doc._id, doc);
    ProductKitsDataEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductKitsData);
export default ProductKitsDataEvents;
