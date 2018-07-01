/**
 * ProductBrochure model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductBrochure = require('../../sqldb').ProductBrochure;
var ProductBrochureEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductBrochureEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductBrochure) {
  for(var e in events) {
    let event = events[e];
    ProductBrochure.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductBrochureEvents.emit(event + ':' + doc._id, doc);
    ProductBrochureEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductBrochure);
export default ProductBrochureEvents;
