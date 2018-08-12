import { Room } from '../room';

export default async (msg, reply) => {
  const { roomId } = msg;

  try {
    await Room.retrieveById(roomId);
  } catch(e) {
    reply(e, null);
    return;
  }

  try {
    await Room.remove(roomId);
    reply(null, { id: roomId });
  } catch(e) {
    reply(new Error('databaseError'), null);
  }
}