import { Room, isValidRoomType } from '../room';
import * as _ from 'lodash';
import { retrieveUser } from '../utils';

export default async (msg, reply) => {

  const { roomId, roomName, ownerId, meetingTime, userIds, roomType } = msg;
  let modified: boolean = false;
  let room: Room;
  try {
    room = await Room.retrieveById(roomId);
  } catch(e) {
    reply(new Error("RoomNotExist"), null);
    return;
  }
  
  if (!_.isUndefined(roomName)) {
    room.roomName = roomName;
    modified = true;
  }

  try{
    if (!_.isUndefined(ownerId) && await retrieveUser(ownerId) ) {
      room.ownerId = ownerId;
      modified = true;
    }
  } catch(e) {
    console.log("error:", e);
    reply(new Error("UserNotExist"), null);
    return;
  }

  if(!_.isUndefined(meetingTime)){
    if(new Date(meetingTime) < _.now()){
      reply(new Error("DateInThePastError"), null);
      return;
  }
    room.meetingTime = meetingTime;
    modified = true;
  }

try{
  if(_.isArray(userIds)){
    if(userIds.length == 0){
      reply(new Error("UserIdsEmptyError"), null);
      return;
    }
    for(const userId of userIds){
      let user = await retrieveUser(userId);
    }
    room.userIds = userIds;
    modified = true;
  }
} catch(e) {
  console.log(e);
  reply(new Error("UserNotExist"), null);
  return;
}

  if(isValidRoomType(roomType)){
    room.roomType = roomType;
    modified = true;
  }else{
    reply(new Error("InvalidRoomType"), null);
    return;
  }

  if (!modified) {
    reply(new Error('nothingModified'), null);
    return;
  }
  
  try{
    room.patch(); 
    reply(null, { "id": roomId }); 

  } catch(e) {
    reply(new Error('databaseError'), null);
  }

}