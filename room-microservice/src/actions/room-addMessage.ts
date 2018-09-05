import { Room } from '../room';
import { Message, stringToMessageType } from '../message';
import * as _ from 'lodash'

export default async (msg, reply) => {

  const { id, sender, content, messageType, recognizing } = msg;

  if(!id || !sender || !content || !messageType){
      reply(new Error("MissingValueError"), null);
      return;
  }

  if(_.isNil(stringToMessageType(messageType))){
    reply(new Error("InvalidMessageTypeError"), null);
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
  
  room.chatRecord.push(new Message({sender, content, messageType, recognizing}));

  try {
    room.patch();
    reply(null, { id: room.chatRecord[room.chatRecord.length - 1].id });
  } catch (e) {
    reply(new Error('databaseError'), null);
  }

};