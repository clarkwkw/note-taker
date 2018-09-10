import { get } from './rest';

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