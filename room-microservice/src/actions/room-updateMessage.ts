import { Message } from '../message';

export default async (msg, reply) => {

  const { messageId, content, userId } = msg;

  if(!messageId || !content){
      reply(new Error("MissingValueError"), null);
      return;
  }

  let message: Message;
  try{
    message = await Message.retrieveById(messageId);

    if(message.sender != userId){
        reply(new Error("UnauthorizedError"), null);
        return;
    }

    message.recognizing = false;
    message.content = content;
    message.patch();

    reply(null, { id: messageId });
  }catch(e){
      reply(e, null);
      return;
  }
};