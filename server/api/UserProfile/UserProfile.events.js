/**
 * UserProfile model events
 */

'use strict';

import {EventEmitter} from 'events';
var UserProfile = require('../../sqldb').UserProfile;
var UserProfileEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserProfileEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(UserProfile) {
  for(var e in events) {
    let event = events[e];
    UserProfile.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    UserProfileEvents.emit(event + ':' + doc._id, doc);
    UserProfileEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(UserProfile);
export default UserProfileEvents;
