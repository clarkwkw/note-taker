import * as _ from 'lodash'
import { supportedLanguages, createSTTTask, removeFile, updateMessage } from '../utils'

export default async (msg, reply) => {
    const { filename, language, messageId, userId } = msg;

    if(_.isUndefined(filename)){
        reply(new Error("invalidFilename"), null);
        return;
    }

    if(!_.includes(supportedLanguages, language)){
        reply(new Error("invalidLanguage"), null);
        return;
    }

    let transcriptPromise: any = createSTTTask(filename, language);
    reply(null, {result: "submitted"});

    let transcript = await transcriptPromise;
    await updateMessage(messageId, userId, transcript);

    removeFile(filename);
}