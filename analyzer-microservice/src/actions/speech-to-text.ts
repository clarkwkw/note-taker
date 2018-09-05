import * as _ from 'lodash';
import { createSTTTask, removeFile, supportedLanguages } from '../utils';

export default async (msg, reply) => {
    const { filename, language } = msg;

    if(_.isUndefined(filename)){
        reply(new Error("invalidFilename"), null);
        return;
    }

    if(!_.includes(supportedLanguages, language)){
        reply(new Error("invalidLanguage"), null);
        return;
    }

    try{
        let transcript = await createSTTTask(filename, language);
        reply(null, {transcript});
    }catch(e){
        reply(e, null);
    }
    removeFile(filename);
  }