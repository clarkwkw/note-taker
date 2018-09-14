import * as express from 'express';

import { act, handleAudioUpload } from '../utils';

const router = express.Router();

/**
 * @api {get} /room/addTextMessage/id/:roomId Add Room Message
 * @apiName room_addTextMessage
 * @apiPermission None
 * @apiGroup Room
 *
 * @apiParam {String} roomId Id of the room
 * @apiParam {String} sender Id of the sender
 * @apiParam {String} content Content of the message
 * @apiParam {String} messageType type of the message
 * 
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "{{id-placeholder}}"
 *    }
 *
 * @apiError (Error 500) {String} error Possible value: 'roomNotExist', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "roomNotExist"
 *    }
 */
router.put('/text/id/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const { content } = req.body;
    try {
      const messageId = await act({ role: 'room', cmd: 'roomAddTextMessage', id: roomId, sender: req.user.id, content });
      res.json(messageId);
    } catch (err) {
      res.status(500).json({ error: err.details.message });
    }
  });
  
  router.put('/speech/id/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const { language } = req.body;
  
    let uploadPath = await handleAudioUpload(req, res);
    try {
      const messageId = await act({ role: 'room', cmd: 'roomAddSpeechMessage', id: roomId, sender: req.user.id, language, filename: uploadPath});
      res.json(messageId);
    } catch (err) {
      res.status(500).json({ error: err.details.message });
    }
  });
  
  router.patch('/id/:messageId', async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    try {
      const message = await act({ role: 'room', cmd: 'roomUpdateMessage', messageId, content, userId: req.user.id });
      res.json(message);
    } catch (err) {
      res.status(500).json({ error: err.details.message });
    }
  });

  export default router;