import { Room } from '../room';
import { Message } from '../message';
import * as _ from 'lodash';
import { retrieveUser } from '../utils';

export default async (msg, reply) => {

  const { roomId, query } = msg;
  let room: Room;

  try {
    if (!_.isUndefined(query)) {
      let rooms = await Room.retrieveMany(query, Infinity); 
      reply(null, rooms);
      return;
    } else {
      room = await Room.retrieveById(roomId);
    }
  } catch(e) {
    reply(new Error('roomNotExist'), null);
    return;
  }
  
    let chatRecordObjs: Message[] = await Promise.all(room.chatRecord.map(async messageId => {
      return await Message.retrieveById(messageId);
    }));

    let userObjs: any[] = await Promise.all(room.userIds.map(async userId => {
      let user = await retrieveUser(userId);
      return _.pick(user, ["id", "username"]);
    }))
    
    let userDict: any = {}
    userObjs.forEach(userObj => userDict[userObj.id] = userObj);
  
    const castedRoom: any = room;
    castedRoom.chatRecord = chatRecordObjs;
    castedRoom.userDict = userDict;
    
    reply(null, room);
  
}

