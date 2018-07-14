/**
 * Status model events
 */

'use strict';

import {EventEmitter} from 'events';
var Status = require('../../sqldb').Status;
var StatusEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StatusEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Status) {
  for(var e in events) {
    let event = events[e];
    Status.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    StatusEvents.emit(event + ':' + doc._id, doc);
    StatusEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Status);
export default StatusEvents;
