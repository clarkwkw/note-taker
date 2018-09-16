import { get, post } from './rest';
import * as _ from 'lodash';

export async function getRooms(){
    let response = await get("/room/list");
    console.log("/room/list: ", response);
    return response.rooms || [];
}

export async function getRoom(id){
    let response = await get("/room/id/"+id);
    console.log("/room/id/{:id}: ", response);
    return response;
}

export async function createRoom(roomName, meetingTime, participants, roomType){
    let response = await post("/room/create", {roomName, meetingTime, userIds: participants, roomType});
    if(!_.isNil(response.id)){
        return response.id;
    }
    if(!_.isNil(response.error)){
        throw(response.error)
    }
    throw(new Error("UnknownError"));
}