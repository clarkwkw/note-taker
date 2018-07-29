import User from '../model';
import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';

// action to modify an existing user
export default async (msg, reply) => {

  const { userId, password, email } = msg;

  let hashedPassword;
  let anyModified = false;

  try {
    if (_.isString(password)) {
      if (password.length == 0) {
        throw new Error('passwordInvalid');
      }
      hashedPassword = await bcrypt.hash(password, 10); // hash the password
    }
  } catch(e) {
    reply(new Error('passwordInvalid'));
    return;
  }

  try {

    // try to see if the user really exist
    const user: User = await User.retrieveById(userId);

    if (!_.isUndefined(hashedPassword)) {
      user.password = hashedPassword; // set the hashedPassword to password
      anyModified = true;
    }

    if (!_.isUndefined(email)) {
      user.email = email; // update email
      anyModified = true;
    }

    if (!anyModified) {
      reply(new Error('nothingModified'), null); // return this if the input data is exactly the same as the stored data
      return;
    }

    user.patch(); // patch the object in database
    reply(null, { "id": userId }); // return the id of the patched object

  } catch(e) {
    reply(new Error('userNotExist'), null);
  }

}