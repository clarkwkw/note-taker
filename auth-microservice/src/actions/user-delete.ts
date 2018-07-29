import User from '../model';

// action to delete a user
export default async (msg, reply) => {
  const { userId } = msg;

  // validate userId first
  try {
    await User.retrieveById(userId);
  } catch(e) {
    // user not exist
    reply(e, null);  // propagate the error to send if any
    return;
  }

  try {
    await User.remove(userId);
    reply(null, { id: userId }); // return the id of the user removed
  } catch(e) {
    reply(new Error('databaseError'), null);
  }
}