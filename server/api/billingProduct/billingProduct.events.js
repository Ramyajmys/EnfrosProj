/**
 * BillingProduct model events
 */

'use strict';

import {EventEmitter} from 'events';
var BillingProduct = require('../../sqldb').BillingProduct;
var BillingProductEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BillingProductEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(BillingProduct) {
  for(var e in events) {
    let event = events[e];
    BillingProduct.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    BillingProductEvents.emit(event + ':' + doc._id, doc);
    BillingProductEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(BillingProduct);
export default BillingProductEvents;
