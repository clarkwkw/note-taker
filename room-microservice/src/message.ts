import * as mongoose from 'mongoose';
import * as _ from 'lodash';

export class Message{
    id: string = null;
    sender: string = null;
    timestamp: Date = null;
    content: string = null;
    recognizing: boolean = false;
    messageType: string = null;

    static schema = new mongoose.Schema({
        sender: String,
        timestamp: Date,
        content: String,
        messageType: String,
        recognizing: Boolean
      });
    
    static model = mongoose.model('Message', Message.schema);

    constructor(object: any) {
        const { _id: id, sender, timestamp, content, messageType, recognizing} = object;
        this.sender = sender;
        this.timestamp = timestamp || new Date();
        this.content = content;
        this.messageType = messageType;
        this.id = id;
        if(recognizing)this.recognizing = true;
      }
    
      getMongooseModel(){
        return new Message.model({
          _id: this.id,
          sender: this.sender,
          timestamp: this.timestamp,
          content: this.content,
          messageType: this.messageType,
          recognizing: this.recognizing
        });
      }

    
}