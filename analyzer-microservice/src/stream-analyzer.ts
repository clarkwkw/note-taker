import { speech } from './utils';

export default class StreamAnalyzer{
    recognizeStream = null;
    callback = null;
    lang = null;
    lastReset = null;

    constructor(callback, lang){
        this.callback = callback;
        this.lang = lang;
    }

    resetRecognitionStream = function() {
        if(this.recognizeStream){
            this.recognizeStream.end();
        }

        this.recognizeStream = speech.streamingRecognize(generateConfig(this.lang))
            .on('error', (err) => {
                this.callback('gcStreamError', err);
                this.resetRecognitionStream();
            })
            .on('data', (data) => {
                this.callback('speechData', data);
                if (data.results[0] && data.results[0].isFinal) {
                    this.stopRecognitionStream();
                    this.startRecognitionStream();
                }
        });

        this.lastReset = new Date();
    }

    startRecognitionStream = function(){
        this.resetRecognitionStream();
    }

    stopRecognitionStream = function(){
        if(this.recognizeStream){
            this.recognizeStream.end();
        }
        this.recognizeStream = null;
    }

    receiveAudio = function(audio) {
        const timeAfterReset = ((new Date()).getTime() - this.lastReset.getTime())/1000;
        if(!this.recognizeStream || timeAfterReset > 50){
            this.resetRecognitionStream();
        }
        this.recognizeStream.write(audio);
    }
}

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;

let generateConfig = function (langCode){
    var config = {
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: langCode
        },
        single_utterance: false,
        interimResults: true // If you want interim results, set this to true
    };
    return config;
} 