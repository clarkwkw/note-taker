import * as mongoose from 'mongoose';

import { seneca } from './utils';


import test from './actions/test';

// connect to the database
mongoose.connect('mongodb://mongo:27017/location');

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
  });