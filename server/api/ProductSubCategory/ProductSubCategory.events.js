/**
 * ProductSubCategory model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductSubCategory = require('../../sqldb').ProductSubCategory;
var ProductSubCategoryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductSubCategoryEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductSubCategory) {
  for(var e in events) {
    let event = events[e];
    ProductSubCategory.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductSubCategoryEvents.emit(event + ':' + doc._id, doc);
    ProductSubCategoryEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(ProductSubCategory);
export default ProductSubCategoryEvents;
