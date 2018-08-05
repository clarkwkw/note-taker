
import * as _ from 'lodash';
import { translate } from '../utils';

const supportedTextLanguages: String[] = ["zh-TW", "en"];

export default async (msg, reply) => {
    const { text, toLanguage } = msg;
    if(_.isUndefined(text)){
      reply(new Error("invalidText"), null);
      return;
    }
    if(!_.includes(supportedTextLanguages, toLanguage)){
      reply(new Error("invalidLanguage"), null);
      return;
    }

    try{
      const result = await translate.translate(text, toLanguage);
      reply(null, { status: 'ok', result: result[0] });
    }catch(error){
      reply(error, null);
    }
  }