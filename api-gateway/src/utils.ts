import * as senecaClass from 'seneca';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { v1 as uuid } from 'uuid';
import * as path from 'path';

export const seneca = senecaClass();
export const act: any = Bluebird.promisify(seneca.act, { context: seneca });

// server secret, DON'T TELL ANYONE, just kidding.
export const SERVER_SECRET = 'thisistheserversecret';

// middleware to catch all the unhandled error
export const errorMiddleware
  = (err, req, res, next) => {
  console.log(err);
  let error = 'unknownError';
  if (err.seneca === true) { /* is a seneca error */
    error = err.details.message;
  } else if (err.name === 'UnauthorizedError') { /* unauthorized */
    error = 'authError';
    res.status(403).json({ status: 'error', error }); // send a 403 status if autheication error detected
    return;
  }
  res.status(500).json({ status: 'error', error });
};

export async function handleAudioUpload(req, res){
  if (!req.files) {
    return res.status(500).json({ error: 'noFileUploaded' });
  }

  const { audio } = req.files;
  if (_.isUndefined(audio)) {
    res.status(500).json({ error: 'noFileUploaded' });
  }

  const filename = `${uuid()}${path.extname(audio.name)}`;
  const uploadPath = `/data/audio/${filename}`;

  const move = uploadPath => new Promise((resolve, reject) => {
    audio.mv(uploadPath, err => {
      if (err) { reject(err); }
      resolve();
    });
  });

  try {
    await move(uploadPath);
    return uploadPath;
  } catch (e) {
    res.status(500).json({ error: 'uploadFailed' });
  }
}