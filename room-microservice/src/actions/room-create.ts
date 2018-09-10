import { Room, isValidRoomType } from '../room';
import * as _ from 'lodash';

export default async (msg, reply) => {

  const { roomName, ownerId, meetingTime, userIds, roomType } = msg;

  if(!roomName || !ownerId || !meetingTime || !userIds || !roomType){
      reply(new Error("MissingValueError"), null);
      return;
  }

  if(!isValidRoomType(roomType)){
    reply(new Error("InvalidRoomTypeError"), null);
      return;
  }

  if(new Date(meetingTime) < _.now()){
      reply(new Error("DateInThePastError"), null);
      return;
  }

  if(!_.isArray(userIds) || userIds.length == 0){
      reply(new Error("UserIdsEmptyError"), null);
      return;
  }
  
  const room = new Room({ roomName, ownerId, meetingTime, userIds, roomType });
  
  try {
    let res = await room.save();
    reply(null, { id: res });
  } catch (e) {
    reply(new Error('databaseError'), null);
  }

};