import * as mongoose from 'mongoose';
import * as _ from 'lodash';

export default class User {

  // initialize the structure of user object
  id: string = null;
  username: string = null;
  password: string = null;
  email: string = null;

  // define the user schema
  static schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
  });

  // define a new model according to the schema
  static model = mongoose.model('User', User.schema);

  static async retrieve(query: Object) {
    let result;
    try {
      result = await this.model.findOne(query);
      if (!result) return null;
    } catch (e) {
      throw new Error("databaseError");
    }
    return new User(result);
  }

  // create the new object and assigned to this
  constructor(object: any) {
    const { username, password, _id: id, email } = object;
    this.username = username;
    this.password = password;
    this.id = id;
    if (!_.isUndefined(email)) { // if email is defined, assign it to this
      this.email = email;
    } else {
      this.email = "abc@example.com"; // else: just assign it to something for backward compatibility
    }
  }

  // save the object
  async save() {
    const model = new User.model({
      username: this.username,
      password: this.password,
      email: this.email
    });
    return await model
      .save() // ask the database to save
      .then(product => mongoose.Types.ObjectId(product._id)); // return the id of the created object
  }

  // modify an existing object
  async patch() {
    const newInfo = {
      username: this.username,
      password: this.password,
      email: this.email
    }
    try {
      await User.model.findByIdAndUpdate(this.id, newInfo); // ask database to update
    } catch (e) {
      throw new Error('databaseError');
    }
  }

  // retrieve a user by userId
  static async retrieveById(userId: String) {
    let result;
    try {
      result = await User.model.findById(userId); // retrieve user by userId
    } catch(e) {
      throw new Error(e);
    }
    return new User(result); // return a user encapsulated in a Model instance
  }

  // retrieve a list of users by conititions
  static async retrieveMany(conditions : Object, resultLimit : number) {
    let searchResult, result = [];
    if (resultLimit != Infinity) {
      searchResult = await User.model
        .find(conditions) // search by condition
        .sort({ _id: -1 }) // decreasing order
        .limit(resultLimit); // limit to resultLimit
    } else {
      searchResult = await User.model.find(conditions);
    }
    return searchResult.map(result => new User(result)); // return list of user encapsulated in a Model instance
  }

  // delete user by userId
  static async remove(userId: String) {
    await User.model.findByIdAndRemove(userId);
  }

}
