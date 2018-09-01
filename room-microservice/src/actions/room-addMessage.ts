import { Room } from '../room';
import { Message } from '../message';
import * as utils from '../utils'
import * as _ from 'lodash'

export default async (msg, reply) => {

  const { id, sender, content, messageType} = msg;

  if(!id || !sender || !content || !messageType){
      reply(new Error("MissingValueError"), null);
      return;
  }

  if(!_.isString(content) || content.length == 0){
    reply(new Error("MissingValueError"), null);
    return;
  }

  let room: Room;
  try{
    room = await Room.retrieveById(id);
    if(room.userIds.findIndex(userId => userId == sender) == -1){
        reply(new Error("UserNotFoundError"), null);
        return;
    }
  }catch(e){
      reply(e, null);
      return;
  }
  
  room.chatRecord.push(new Message({sender, content, messageType}));

  try {
    room.patch();
    reply(null, { id: room.id });
  } catch (e) {
    reply(new Error('databaseError'), null);
  }

};