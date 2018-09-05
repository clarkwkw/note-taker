import * as senecaClass from 'seneca';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';

export const seneca = senecaClass();
export const act : any = Bluebird.promisify(seneca.act, {context: seneca});

export async function retrieveUser(userId: string){
    if(!_.isString(userId)){
        throw new Error("UserNotExist");
    }
    
    try{
        let user = await act({ role: 'auth', cmd: 'userRetrieve', userId});
        return user;
    }catch(e){
        throw new Error("UserNotExist");
    }
}

export async function speechToTextAsync(filename, language, messageId, sender){
    await act({ role: 'analyzer', cmd: 'speech-to-text-async', filename, language, messageId, userId: sender });
}