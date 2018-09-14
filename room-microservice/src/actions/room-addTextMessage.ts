import { Room } from '../room';
import { Message } from '../message';
import * as _ from 'lodash'

export default async (msg, reply) => {

  const { id, sender, content } = msg;

  if(!id || !sender || !content){
      reply(new Error("MissingValueError"), null);
      return;
  }

  if(!_.isString(content) || content.length == 0){
    reply(new Error("MissingValueError"), null);
    return;
  }

  let room: Room, message: Message;
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
  
  message = new Message({ sender, content, messageType: "TEXT", recognizing: false, roomId: room.id });
  try {
    let messageId = await message.save();
    room.chatRecord.push(""+messageId);
    await room.patch();
    reply(null, { id: messageId });
  } catch (e) {
    reply(new Error('databaseError'), null);
  }
};