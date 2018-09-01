import * as mongoose from 'mongoose';

import { seneca } from './utils';


import test from './actions/test';
import translate from './actions/translate'
import speechToText from './actions/speech-to-text'
import socketServer from './socket'

// connect to the database
mongoose.connect('mongodb://mongo:27017/analyzer');

// error handler
mongoose.connection.on('error', () => {
  console.error('MongoDB connection error.');
});

// listen to all the microservice call, also ready to be called
seneca
  .listen({ port: '3001', pin: 'role:analyzer' })
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3002', pin: 'role:auth' })
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3003', pin: 'role:room' })
  .ready(() => {
    seneca // register to seneca the actions that this microservice can handle
      .add('cmd:test', test)
      .add('cmd:translate', translate)
      .add('cmd:speech-to-text', speechToText)
  });

  socketServer.listen(4001);