import * as senecaClass from 'seneca';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as Speech from '@google-cloud/speech';
import * as Translate from '@google-cloud/translate';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

export const seneca = senecaClass();
export const act : any = Bluebird.promisify(seneca.act, {context: seneca});

export const speech = new Speech.SpeechClient();

export const translate = Translate();

export const supportedLanguages: String[] = ["yue-Hant-HK","cmn-Hans-HK", "en-US"];

//Reference: https://medium.com/cod3/convert-speech-from-an-audio-file-to-text-using-google-speech-api-b951f4032a64
export async function convertAudio(pathIn, pathOut){
	if(!pathIn || !pathOut){
		throw new Error('Unspecified pathIn / pathOut');
	}
	if (!fs.existsSync(pathIn)) {
		throw new Error('File not found');
	}
	if(pathIn == pathOut){
		return new Promise((resolve, reject) => { resolve(); });
	}

	var outStream = fs.createWriteStream(pathOut);

	return new Promise((resolve, reject) => {
		ffmpeg()
		.input(pathIn)
		.outputOptions([
			'-f s16le',
			'-acodec pcm_s16le',
			'-vn',
			'-ac 1',
			'-ar 16k',
			'-map_metadata -1'
			])
		.on('error', (err) => {
			reject(err);
		})
		.on('end', () => {
			outStream.end();
			resolve();
		})
		.pipe(outStream, { end: true });
	});
}

export function replaceExt(pathStr: string, ext: string){
	return pathStr.substring(0, pathStr.length - path.extname(pathStr).length) +"."+ ext;
}

export function removeFile(path: string){
	fs.unlink(path, (err) => {
		if(err)console.log("Failed to remove audio file '"+path+"'");
		else console.log("Removed audio file '"+path+"'");
	})
}

export async function updateMessage(messageId, userId, content){
	await act({ role: 'room', cmd: 'roomUpdateMessage', messageId, content, userId });
}


function generateSTTRequestObject(audioBytes, language){
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

	return request;
}

export function createSTTTask(filename, language){
	return new Promise(async (resolve, reject) => {
		let newFilename, audioBytes;
		try{
			newFilename = replaceExt(filename, "raw");
			await convertAudio(filename, newFilename);
			const file = fs.readFileSync(newFilename);
			audioBytes = file.toString('base64');
		}catch(err){
			reject(new Error("fileConvertFailed"));
		}

		try{
			const request = generateSTTRequestObject(audioBytes, language);
			let rawResult = speech.longRunningRecognize(request).then(responses => {
				var operation = responses[0];
				var initialApiResponse = responses[1];
				return operation.promise();
			})

			let results: any[] = (await rawResult)[0].results, transcript;

			if(results.length > 0){
				transcript = results[0].alternatives[0].transcript;
				resolve(transcript);
			}else{
			  reject(new Error("unexpectedSTTResponseError"));
      }
		}catch(err){
			reject(err);
    }
    removeFile(newFilename);
	});
}