import { Room } from '../room';
import * as _ from 'lodash';

export default async (msg, reply) => {

  const { roomId, query } = msg;

  try {
    if (!_.isUndefined(query)) {
      let rooms = await Room.retrieveMany(query, Infinity); 
      reply(null, rooms);
    } else {
      const room: Room = await Room.retrieveById(roomId); 
      reply(null, room);
    }
  } catch(e) {
    reply(new Error('roomNotExist'), null);
  }

}

