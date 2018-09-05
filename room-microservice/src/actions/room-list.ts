import { Room } from '../room';

export default async (msg, reply) => {
  const { userId } = msg;
  try {
    let rooms: [Room] = await Room.retrieveMany({
            userIds: {
                $elemMatch: {
                    $eq: userId
                }
            }
        }, 
        Infinity
    );
    reply(null, { rooms });
  } catch(e) {
    reply(new Error('databaseError'), null);
  }
}