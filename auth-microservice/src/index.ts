import * as mongoose from 'mongoose';
import * as Seneca from 'seneca';

import { seneca } from './utils';

import test from './actions/test';
import userLogin from './actions/user-login';
import userCreate from './actions/user-create';
import userRetrieve from './actions/user-retrieve';
import userPatch from './actions/user-patch';
import userDelete from './actions/user-delete';

// connect to mongodb
mongoose.connect('mongodb://mongo:27017/user');

// error handler
mongoose.connection.on('error', () => {
  console.error('MongoDB connection error.');
});

// listen to all the microservice call, also ready to be called
seneca
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3001', pin: 'role:analyzer' })
  .listen({ port: '3002', pin: 'role:auth' })
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3003', pin: 'role:room' })
  .ready(() => {
    seneca // register to seneca the actions that this microservice can handle
      .add('cmd:test', test)
      .add('cmd:userLogin', userLogin)
      .add('cmd:userCreate', userCreate)
      .add('cmd:userRetrieve', userRetrieve)
      .add('cmd:userPatch', userPatch)
      .add('cmd:userDelete', userDelete);
  });
