import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as jwt from 'jsonwebtoken';

import { act, SERVER_SECRET } from './utils';

// invoked when login, call auth microservice to login
passport.use(new LocalStrategy(
  async (username, password, cb) => {
    try {
      const user = await act({ role: 'auth', cmd: 'userLogin', username, password });
      return cb(null, user); // if successful, login
    } catch (err) {
      return cb(err, null); // propagate error if any
    }
  }
));

// generate user session token
export const generateTokenMiddleware = function (req, res, next) {
  req.token = jwt.sign({
    id: req.user.id
  }, SERVER_SECRET, { expiresIn: '24h' }); // token expired in 24 hours
  next();
};