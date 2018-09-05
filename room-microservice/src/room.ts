import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import {Message} from './message';

export enum RoomType {
    ONLINE,
    OFFLINE
}

export function stringToRoomType(str: keyof RoomType): RoomType{
  return RoomType[<string>str];
}

export class Room {

  id: string = null;
  roomName: string = null;
  ownerId: string = null;
  meetingTime: string = null;
  userIds: string[] = [];
  roomType: RoomType = null;
  chatRecord: Message[] = [];

  static schema = new mongoose.Schema({
    roomName: String,
    ownerId: String,
    meetingTime: Date,
    userIds: [String],
    roomType: String,
    chatRecord: [Message.schema]
  });

  static model = mongoose.model('Room', Room.schema);

  static async retrieve(query: Object) {
    let result;
    try {
      result = await this.model.findOne(query);
      if (!result) return null;
    } catch (e) {
      throw new Error("databaseError");
    }
    return new Room(result);
  }

  // create the new object and assigned to this
  constructor(object: any) {
    const { _id: id, roomName, ownerId, meetingTime, userIds, roomType, chatRecord } = object;
    
    this.roomName = roomName;
    this.ownerId = ownerId;
    this.meetingTime = meetingTime;
    this.userIds = userIds;
    this.roomType = stringToRoomType(roomType);
    if(_.isArray(chatRecord)){
      this.chatRecord = chatRecord.map(msg => new Message(msg));
    }else{
      this.chatRecord = []
    }  
    this.id = id;
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
      let p = new Promise(async (resolve, reject) => {
        await Room.model.findByIdAndUpdate(this.id, model, {new: true}, (err, doc) => {
          this.chatRecord = doc["chatRecord"].map(subDoc => new Message(subDoc));
          if(err)reject(err);
          resolve();
        }); // ask database to update
      });
      await p;
    } catch (e) {
        throw new Error('databaseError');
    }
  }

  getMongooseModel(){
    return new Room.model({
        _id: this.id,
        roomName: this.roomName,
        ownerId: this.ownerId,
        meetingTime: this.meetingTime,
        userIds: this.userIds,
        roomType: RoomType[this.roomType],
        chatRecord: this.chatRecord.map(record => record.getMongooseModel())
      });
  }

  static async retrieveById(roomId: String) {
    let result;
    try {
      result = await Room.model.findById(roomId);
    } catch(e) {
      throw new Error(e);
    }
    return new Room(result);
  }

  static async retrieveMany(conditions : Object, resultLimit : number) {
    let searchResult, result = [];
    if (resultLimit != Infinity) {
      searchResult = await Room.model
        .find(conditions) // search by condition
        .sort({ _id: -1 }) // decreasing order
        .limit(resultLimit); // limit to resultLimit
    } else {
      searchResult = await Room.model.find(conditions);
    }
    return searchResult.map(result => new Room(result));
  }

  static async remove(roomId: String) {
    await Room.model.findByIdAndRemove(roomId);
  }


}
