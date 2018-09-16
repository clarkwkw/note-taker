import { get } from './rest';

export async function searchUser(username, resultLimit){
    let users = []
    try{
        users = (await get("/auth/search", {username, resultLimit})).users;
    }catch(e){
        console.error("Unexpected error for '/auth/search' from backend:", e);
    }
    return users;
}