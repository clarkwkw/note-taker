import { speech } from './utils';

export default class StreamAnalyzer{
    recognizeStream = null;

    constructor(){

    }

    startRecognitionStream = function(client, lang){

        this.recognizeStream = speech.streamingRecognize(generateConfig(lang))
            .on('error', (err) => {
                client.emit('gcStreamError', err);
                this.stopRecognitionStream();
            })
            .on('data', (data) => {
                client.emit('speechData', data);
                if (data.results[0] && data.results[0].isFinal) {
                    this.stopRecognitionStream();
                    this.startRecognitionStream(client,lang);
                }
            });
    }

    stopRecognitionStream = function(){
        if(this.recognizeStream){
            this.recognizeStream.end();
        }
        this.recognizeStream = null;
    }

    receiveAudio = function(audio) {
        if (this.recognizeStream) {
            this.recognizeStream.write(audio);
        }
    }
}


const encoding = 'LINEAR16';
const sampleRateHertz = 16000;

let generateConfig = function (langCode){
    var config = {
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: langCode,
            profanityFilter: false,
            enableWordTimeOffsets: true
        },
        interimResults: true // If you want interim results, set this to true
    };
    return config;
} 