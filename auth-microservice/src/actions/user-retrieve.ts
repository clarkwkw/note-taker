import User from '../model';
import * as _ from 'lodash';

// retrieve user by userId or by query
export default async (msg, reply) => {

  const { userId, query } = msg;
    if (!_.isUndefined(query)) {

      let { username, resultLimit } = query;
      if(_.isUndefined(username)){
        reply(new Error("EmptyUsername"), null);
        return;
      }

      if(!_.isUndefined(resultLimit) && !_.toInteger(resultLimit)){
        reply(new Error("InvalidResultLimit"), null);
        return;
      }

      let mongoQuery = {
        username: new RegExp("^"+username.toLowerCase())
      }
      let users;
      try{
        users = await User.retrieveMany(mongoQuery, _.toInteger(resultLimit) || 5); // retrieve the user by query
      }catch(e){
        console.log("err:", e);
        reply(new Error('databaseError'), null);
        return
      }
      users = users.map(user => {
        return _.omit(user, 'password'); // return the user object (with password removed)
      });
      reply(null, users);
    } else {
      try {
        const user: User = await User.retrieveById(userId); // retrieve user by userId
        reply(null, _.omit(user, 'password')); // return the user object (with password removed)
      } catch(e) {
        reply(new Error('userNotExist'), null);
      }
  
    }
  
}

