/**
 * PurchaseEntries model events
 */

'use strict';

import {EventEmitter} from 'events';
var PurchaseEntries = require('../../sqldb').PurchaseEntries;
var PurchaseEntriesEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PurchaseEntriesEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(PurchaseEntries) {
  for(var e in events) {
    let event = events[e];
    PurchaseEntries.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    PurchaseEntriesEvents.emit(event + ':' + doc._id, doc);
    PurchaseEntriesEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(PurchaseEntries);
export default PurchaseEntriesEvents;
