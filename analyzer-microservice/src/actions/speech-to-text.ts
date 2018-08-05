import * as _ from 'lodash';
import { speech } from '../utils';
import * as fs from 'fs';

const supportedLanguages: String[] = ["yue-Hant-HK","cmn-Hans-HK", "en-US"];

export default async (msg, reply) => {
    const { filename, language } = msg;
    let audioBytes;

    if(_.isUndefined(filename)){
        reply(new Error("invalidFilename"), null);
        return;
    }

    if(!_.includes(supportedLanguages, language)){
        reply(new Error("invalidLanguage"), null);
        return;
    }

    try{
        const file = fs.readFileSync(filename);
        audioBytes = file.toString('base64');
    }catch(err){
        reply(new Error("fileConvertFailed"), null);
        return;
    }
    
    const audio = {
        content: audioBytes,
      };

    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: language
    };

    const request = {
        config: config,
        audio: audio,
    };

    try{
        let results: any[] = (await speech.recognize(request))[0].results;
        if(results.length > 0){
            results = results[0].alternatives;
        }
        reply(null, { status: 'ok', result: results });
    }catch(err){
        console.log("error occured: "+err);
        reply(err, null);
    }

    fs.unlink(filename, (err) => {
        if(err)console.log("Failed to remove audio file '"+filename+"'");
        else console.log("Removed audio file '"+filename+"'");
    })
  }