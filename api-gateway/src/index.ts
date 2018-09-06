import * as express from 'express';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as https from 'https';
import * as _ from 'lodash';
import * as expressJwt from 'express-jwt';
import * as fileUpload from 'express-fileupload';
import * as fs from 'fs';

import { seneca, act, errorMiddleware, SERVER_SECRET } from './utils';

import './passport';

/* import the SSL keys */

const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

/* import routes */

import test from './routes/test';
import auth from './routes/auth';

import analyzer from './routes/analyzer';
import room from './routes/room';

import message from './routes/message';

const app = express();

// for parsing payload
app.use(bodyParser.json({limit: "150mb"}));
app.use(bodyParser.urlencoded({limit: "150mb", extended: false }));
app.use(cookieParser());

// for cross-site connection
app.use(cors());

// for authenication
app.use(passport.initialize());
app.use(passport.session());

// for uploading file to the user
app.use(fileUpload());

// for generating user token
app.use(
  expressJwt({ secret: SERVER_SECRET }).unless({
    path: [
      '/test/',
      '/auth/login',
      '/auth/signup',
      /\/static\/.*/
    ]
  })
);

// initialize all path

app.use('/test', test);
app.use('/auth', auth);

app.use('/analyzer', analyzer);
app.use('/room', room);

app.use('/message', message);

app.use(errorMiddleware); // keep this as last middleware, which catches all error

// register this as a client for all microservice
seneca
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3001', pin: 'role:analyzer', timeout: 600000 })
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3002', pin: 'role:auth' })
  .client({ host: process.env.BRIDGE_ADDRESS, port: '3003', pin: 'role:room' });


// kickstart the server
https
  .createServer({
    key, cert
  }, app)
  .listen(3000);
  //https.createServer({}, app).listen(3000);