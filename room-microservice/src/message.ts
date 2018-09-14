import * as mongoose from 'mongoose';
import * as _ from 'lodash';

export class Message{
    id: string = null;
    roomId: string = null;
    sender: string = null;
    timestamp: Date = null;
    content: string = null;
    recognizing: boolean = false;
    messageType: [string] = null;

    static schema = new mongoose.Schema({
        sender: mongoose.SchemaTypes.ObjectId,
        timestamp: Date,
        content: String,
        messageType: String,
        recognizing: Boolean,
        roomId: mongoose.SchemaTypes.ObjectId
      });
    
    static model = mongoose.model('Message', Message.schema);

    constructor(object: any) {
        const { _id: id, sender, timestamp, content, messageType, recognizing, roomId } = object;
        this.sender = sender;
        this.timestamp = timestamp || new Date();
        this.content = content;
        this.messageType = messageType;
        this.id = id;
        this.roomId = roomId;
        if(recognizing)this.recognizing = true;
      }
    
      static async retrieveById(messageId: String) {
        let result;
        try {
          result = await Message.model.findById(messageId);
        } catch(e) {
          throw new Error(e);
        }
        if(_.isNil(result)){
          throw new Error("MessageNotFoundError");
        }
        return new Message(result);
      }

      static async remove(messageId: String) {
        await Message.model.findByIdAndRemove(messageId);
      }

      static async retrieveMany(conditions : Object, resultLimit : number) {
        let searchResult, result = [];
        if (resultLimit != Infinity) {
          searchResult = await Message.model
            .find(conditions) // search by condition
            .sort({ _id: -1 }) // decreasing order
            .limit(resultLimit); // limit to resultLimit
        } else {
          searchResult = await Message.model.find(conditions);
        }
        return searchResult.map(result => new Message(result));
      }

      getMongooseModel(){
        return new Message.model({
          _id: this.id,
          sender: this.sender,
          timestamp: this.timestamp,
          content: this.content,
          messageType: this.messageType,
          recognizing: this.recognizing,
          roomId: this.roomId
        });
      }

      async save() {
        const model = this.getMongooseModel();
        return await model
          .save() // ask the database to save
          .then(product => mongoose.Types.ObjectId(product._id)); // return the id of the created object
      }
    
      // modify an existing object
      async patch() {
        const model = this.getMongooseModel();
        try {
          await Message.model.findByIdAndUpdate(this.id, model);
        } catch (e) {
            throw new Error('databaseError');
        }
      }
}