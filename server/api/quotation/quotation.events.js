/**
 * Quotation model events
 */

'use strict';

import {EventEmitter} from 'events';
var Quotation = require('../../sqldb').Quotation;
var QuotationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
QuotationEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Quotation) {
  for(var e in events) {
    let event = events[e];
    Quotation.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    QuotationEvents.emit(event + ':' + doc._id, doc);
    QuotationEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Quotation);
export default QuotationEvents;
