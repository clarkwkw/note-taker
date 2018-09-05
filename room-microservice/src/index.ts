import * as mongoose from 'mongoose';

import { seneca } from './utils';

import test from './actions/test';
import roomCreate from './actions/room-create';
import roomDelete from './actions/room-delete';
import roomPatch from './actions/room-patch';
import roomRetrieve from './actions/room-retrieve';
import addMessage from './actions/room-addMessage';
import roomList from './actions/room-list';
import updateMessage from './actions/room-updateMessage';

// connect to the database
mongoose.connect('mongodb://mongo:27017/room');

// error handler
mongoose.connection.on('error', () => {
  console.error('MongoDB connection error.');
});

// listen to all the microservice call, also ready to be called
seneca
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3001', pin: 'role:analyzer' })
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3002', pin: 'role:auth' })
  .listen({ port: '3003', pin: 'role:room' })
  .ready(() => {
    seneca // register to seneca the actions that this microservice can handle
      .add('cmd:test', test)
      .add('cmd:roomAddMessage', addMessage)
      .add('cmd:roomCreate', roomCreate)
      .add('cmd:roomDelete', roomDelete)
      .add('cmd:roomList', roomList)
      .add('cmd:roomPatch', roomPatch)
      .add('cmd:roomRetrieve', roomRetrieve)
      .add('cmd:roomUpdateMessage', updateMessage)
  });