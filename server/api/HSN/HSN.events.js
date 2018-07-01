/**
 * HSN model events
 */

'use strict';

import {EventEmitter} from 'events';
var HSN = require('../../sqldb').HSN;
var HSNEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HSNEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(HSN) {
  for(var e in events) {
    let event = events[e];
    HSN.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    HSNEvents.emit(event + ':' + doc._id, doc);
    HSNEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(HSN);
export default HSNEvents;
