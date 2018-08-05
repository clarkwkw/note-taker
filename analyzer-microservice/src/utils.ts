import * as senecaClass from 'seneca';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as Speech from '@google-cloud/speech';
import * as Translate from '@google-cloud/translate';

export const seneca = senecaClass();
export const act : any = Bluebird.promisify(seneca.act, {context: seneca});

export const speech = new Speech.SpeechClient({
    projectId: process.env.GOOGLE_PROJECTID,
    keyFilename: 'google-key.json'
  });

export const translate = Translate({
    projectId: process.env.GOOGLE_PROJECTID,
    keyFilename: 'google-key.json'
  });