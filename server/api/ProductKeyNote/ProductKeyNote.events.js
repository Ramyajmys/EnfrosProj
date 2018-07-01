/**
 * ProductKeyNote model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductKeyNote = require('../../sqldb').ProductKeyNote;
var ProductKeyNoteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductKeyNoteEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductKeyNote) {
  for(var e in events) {
    let event = events[e];
    ProductKeyNote.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductKeyNoteEvents.emit(event + ':' + doc._id, doc);
    ProductKeyNoteEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductKeyNote);
export default ProductKeyNoteEvents;
