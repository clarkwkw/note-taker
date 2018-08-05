import * as bcrypt from 'bcryptjs';

import User from '../model';

// action to create a user
export default async (msg, reply) => {

  const { username, password, email } = msg;
  let hashedPassword = await bcrypt.hash(password, 10);
  
  // check if user already exists
  let result: User;
  try {
     result = await User.retrieve({ username });
     if (result) {
      reply(new Error('alreadyExist'), null);
      return;
     }
  } catch(e) {
    reply(e, null);  // propagate the error to send if any
    return;
  }

  /* create new user */
  const user = new User({ username, password: hashedPassword, email });
  try {
    let res = await user.save();
    reply(null, { id: res });
  } catch (e) {
    reply(new Error('databaseError'), null);
  }

};