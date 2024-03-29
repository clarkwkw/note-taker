import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import StreamAnalyzer from './stream-analyzer';
import * as _ from 'lodash';

const socketApp = express();
const socketServer = new http.Server(socketApp);
const io = socketio(socketServer);
let analyzers = {string: StreamAnalyzer};

function generateSocketReplyCallback(client){
    function callback(event, data){
        client.emit(event, data);
    }
    return callback;
}

io.on('connection', function (socket) {

    socket.on('startAnalyzer', function (request) {
        if(_.has(analyzers, request.roomId)){
            analyzers[request.roomId].stopRecognitionStream()
        }
        let analyzer = new StreamAnalyzer(generateSocketReplyCallback(socket), request.langCode);
        analyzer.startRecognitionStream();
        analyzers[request.roomId] = analyzer;
    });

    socket.on('binaryAudioData', function (request) {
        if(_.has(analyzers, request.roomId)){
            analyzers[request.roomId].receiveAudio(request.audio);
        }
    });

    socket.on('endAnalyzer', function(request) {
        if(_.has(analyzers, request.roomId)){
            analyzers[request.roomId].stopRecognitionStream();
            delete analyzers[request.roomId];
        }
    });

});

export default socketServer;