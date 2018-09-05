import { Room } from '../room';

export default async (msg, reply) => {

  const { messageId, userId, content, speechToTextResult } = msg;

  if(!messageId || !userId || !content){
      reply(new Error("MissingValueError"), null);
      return;
  }

  let rooms: [Room];
  try{
    rooms = await Room.retrieveMany({
            chatRecord:{
                $elemMatch:{
                    _id: messageId
                }
            }
        }, 
        1
    );
    if(rooms.length != 1){
        reply(new Error("MessageNotFoundError"), null);
        return;
    }

    let room: Room = rooms[0];
    if(room.userIds.findIndex(userId => userId == userId) == -1){
        reply(new Error("UnauthorizedError"), null);
        return;
    }

    room.chatRecord = room.chatRecord.map(message => {
        if(message.id == messageId){
            if(message.recognizing && !speechToTextResult){
                throw new Error("MessageLockedError");
            }
            message.content = content;
            message.recognizing = false;
        }
        return message;
    });

    room.patch();
    reply(null, { id: messageId });
  }catch(e){
      reply(e, null);
      return;
  }
};