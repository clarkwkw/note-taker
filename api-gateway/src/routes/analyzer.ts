import * as express from 'express';
import * as path from 'path';
import * as _ from 'lodash';
import { v1 as uuid } from 'uuid';

import { act } from '../utils';

const router = express.Router();

/**
 * @api {get} /analyzer/translate Translate Text
 * @apiName translate
 * @apiPermission User
 * @apiGroup Analyzer
 *
 * @apiSuccess {String} result Translated text
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "result": "Hello"
 *    }
 *
 * @apiError (Error 500) {String} error Possible value: 'invalidLanguage', 'invalidText', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "invalidLanguage"
 *    }
 */

router.get('/translate', async (req, res) => {
    const { text, toLanguage } = req.query;
    try {
      const result = await act({ role: 'analyzer', cmd: 'translate', text, toLanguage });
      res.json(result);
    } catch(err) {
      res.status(500).json({ error: err.details.message });
    }
  });

router.put('/speech-to-text/:language', async (req: any, res) => {
    const { language } = req.params;

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
  } catch (e) {
    return res.status(500).json({ error: 'uploadFailed' });
  }

    try {
      const result = await act({ role: 'analyzer', cmd: 'speech-to-text', filename: uploadPath, language });
      res.json(result);
    } catch(err) {
      res.status(500).json({ error: err.details.message });
    }
  });

  export default router;