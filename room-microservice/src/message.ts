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
    messageType: MessageType = null;

    static schema = new mongoose.Schema({
        sender: String,
        roomId: String,
        timestamp: Date,
        content: String,
        messageType: String
      });

    constructor(object: any) {
        const { _id: id, sender, roomId, timestamp, content, messageType} = object;
        this.sender = sender;
        this.roomId = roomId;
        this.timestamp = timestamp || new Date();
        this.content = content;
        this.messageType = stringToMessageType(messageType);
        this.id = id;
      }
}