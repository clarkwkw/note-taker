import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';

import User from '../model';

// action for user to login
export default async (msg, reply) => {

  const { username, password } = msg;
  const user: User = await User.retrieve({ username }); // retrieve the user by username from database

  if (user) { // if the user exist
    // hash the password and check if it matches the user password
    const result = await bcrypt.compare(password, user.password);
    if (result === true) { // if match
      reply(null, _.omit(user, 'password')); // return the user object (with password omitted)
      return;
    } else {
      reply(new Error('wrongPassword'), null);
      return;
    }
  }

  reply(new Error('invalidUser'), null); // if not, throw error

};