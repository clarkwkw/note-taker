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

  let room: Room;
  try{
    room = await Room.retrieveById(id);
    console.log("retrieved");
    if(room.userIds.findIndex(userId => userId == sender) == -1){
        reply(new Error("UserNotFoundError"), null);
        return;
    }
  }catch(e){
      reply(e, null);
      return;
  }
  
  room.chatRecord.push(new Message({sender, content: "", messageType: "SPEECH", recognizing: true}));
  try {
    await room.patch();
    let messageId = room.chatRecord[room.chatRecord.length - 1].id;
    let analysisRequest = await speechToTextAsync(filename, language, messageId, sender);
    reply(null, { id: messageId });
  } catch (e) {
    reply(new Error('databaseError'), null);
  }

};