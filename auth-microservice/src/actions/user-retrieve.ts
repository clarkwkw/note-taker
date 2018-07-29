import User from '../model';
import * as _ from 'lodash';

// retrieve user by userId or by query
export default async (msg, reply) => {

  const { userId, query } = msg;

  try {
    if (!_.isUndefined(query)) {
      let users = await User.retrieveMany(query, Infinity); // retrieve the user by query
      users.map(user => {
        return _.omit(user, 'password'); // return the user object (with password removed)
      });
      reply(null, users);
    } else {
      const user: User = await User.retrieveById(userId); // retrieve user by userId
      reply(null, _.omit(user, 'password')); // return the user object (with password removed)
    }
  } catch(e) {
    reply(new Error('userNotExist'), null);
  }

}

