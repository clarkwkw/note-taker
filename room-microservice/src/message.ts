import * as mongoose from 'mongoose';
import * as _ from 'lodash';

export enum MessageType {
    TEXT,
    SPEECH
}

export function stringToMessageType(str: keyof MessageType): MessageType{
  return MessageType[<string>str];
}

export class Message{
    id: string = null;
    sender: string = null;
    roomId: string = null;
    timestamp: Date = null;
    content: string = null;
    recognizing: boolean = false;
    messageType: MessageType = null;

    static schema = new mongoose.Schema({
        sender: String,
        roomId: String,
        timestamp: Date,
        content: String,
        messageType: String,
        recognizing: Boolean
      });
    
    static model = mongoose.model('Message', Message.schema);

    constructor(object: any) {
        const { _id: id, sender, roomId, timestamp, content, messageType, recognizing} = object;
        this.sender = sender;
        this.roomId = roomId;
        this.timestamp = timestamp || new Date();
        this.content = content;
        this.messageType = stringToMessageType(messageType);
        this.id = id;
        if(recognizing)this.recognizing = true;
      }
    
      getMongooseModel(){
        return new Message.model({
          _id: this.id,
          sender: this.sender,
          roomId: this.roomId,
          timestamp: this.timestamp,
          content: this.content,
          messageType: MessageType[this.messageType],
          recognizing: this.recognizing
        });
      }

    
}