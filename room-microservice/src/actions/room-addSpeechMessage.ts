import { Room } from '../room';
import { Message } from '../message';
import { speechToTextAsync } from '../utils';
import * as _ from 'lodash'

export default async (msg, reply) => {

  const { id, sender, language, filename } = msg;

  if(!id || !sender || !language || !filename){
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
  
  message = new Message({ sender, content: "", messageType: "SPEECH", recognizing: true, roomId: room.id });
  
  try {
    let messageId = await message.save();
    room.chatRecord.push(""+messageId);
    await room.patch();
    await speechToTextAsync(filename, language, messageId, sender);
    reply(null, { id: messageId });
  } catch (e) {
    reply(new Error('databaseError'), null);
  }

};