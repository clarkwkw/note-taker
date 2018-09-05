import * as express from 'express';
import * as _ from 'lodash';

import { act, handleAudioUpload } from '../utils';

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
    let uploadPath = await handleAudioUpload(req, res);
    try {
      const result = await act({ role: 'analyzer', cmd: 'speech-to-text', timeout$: 60000, filename: uploadPath, language });
      res.json(result);
    } catch(err) {
      res.status(500).json({ error: err.details.message });
    }
  });

  export default router;