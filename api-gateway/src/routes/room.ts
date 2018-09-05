import * as express from 'express';
import * as passport from 'passport';

import { act, handleAudioUpload } from '../utils';

const router = express.Router();

/**
 * @api {post} /room/create Create Room
 * @apiName room_create
 * @apiPermission None
 * @apiGroup Room
 *
 * @apiParam {String} roomId Id of the room
 * @apiParam {String} roomName Room name
 * @apiParam {String} ownerId String User ID of the room owner
 * @apiParam {String} meetingTime String Meeting time
 * @apiParam {String} userIds String[] User IDs of participants
 * @apiParam {String} roomType String Room type
 *
 * @apiUse objectId
 *
 * @apiError (Error 500) {String} error Possible value: 'alreadyExist', 'databaseError', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "alreadyExist"
 *    }
 */
router.post('/create', async (req, res) => {
    const { roomName, ownerId, meetingTime, userIds, roomType } = req.body;
    try {
      const { id } = await act({ role: 'room', cmd: 'roomCreate', roomName, ownerId, meetingTime, userIds, roomType });
      res.json({ id });
    } catch (err) {
      res.status(500).json({ error: err.details.message });
    }
  });

/**
 * @api {delete} /room/id/:roomId Delete Room
 * @apiName room_delete
 * @apiPermission None
 * @apiGroup Authentication
 *
 * @apiParam {String} roomId Id of the room
 *
 * @apiUse objectId
 *
 * @apiError (Error 500) {String} error Possible value: 'roomNotExists', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "roomNotExists"
 *    }
 */
router.delete('/id/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
      const id = await act({ role: 'room', cmd: 'roomDelete', roomId });
      res.json(id);
    } catch(err) {
      res.status(500).json({ error: err.details.message });
    }
  });

/**
 * @api {patch} /room/id/:roomId Patch Room
 * @apiName room_patch
 * @apiPermission None
 * @apiGroup Room
 *
 * @apiParam {String} roomId Id of the room
 * @apiParam {String} [roomName] Room name
 * @apiParam {String} [ownerId] String User ID of the room owner
 * @apiParam {String} [meetingTime] String Meeting time
 * @apiParam {String} [userIds] String[] User IDs of participants
 * @apiParam {String} [roomType] String Room type
 *
 * @apiUse objectId
 *
 * @apiError (Error 500) {String} error Possible value: 'roomNotExist', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "roomNotExist"
 *    }
 */
router.patch('/id/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const { roomName, ownerId, meetingTime, userIds, roomType} = req.body;
    try {
      const id = await act({ role: 'room', cmd: 'roomPatch', roomId, roomName, ownerId, meetingTime, userIds, roomType });
      res.json(id);
    } catch(err) {
      res.status(500).json({ error: err.details.message });
    }
  });

/**
 * @api {get} /room/id/:roomId Get Room
 * @apiName room_get
 * @apiPermission None
 * @apiGroup Room
 *
 * @apiParam {String} roomId Id of the room
 *
 * @apiSuccess {String} id Room ID
 * @apiSuccess {String} roomName Room name
 * @apiSuccess {String} ownerId String User ID of the room owner
 * @apiSuccess {String} meetingTime String Meeting time
 * @apiSuccess {String} userIds String[] User IDs of participants
 * @apiSuccess {String} roomType String Room type (online/offline)
 * @apiSuccess {String} chatRecord String[] Chat records
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
router.get('/id/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
      const room = await act({ role: 'room', cmd: 'roomRetrieve', roomId });
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: err.details.message });
    }
  });

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
router.put('/addTextMessage/id/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { content } = req.body;
  try {
    const messageId = await act({ role: 'room', cmd: 'roomAddTextMessage', id: roomId, sender: req.user.id, content });
    res.json(messageId);
  } catch (err) {
    res.status(500).json({ error: err.details.message });
  }
});

router.put('/addSpeechMessage/id/:roomId', async (req, res) => {
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

router.patch('/updateMessage/id/:messageId', async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  try {
    const message = await act({ role: 'room', cmd: 'roomUpdateMessage', messageId, content, userId: req.user.id, speechToTextResult: false });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.details.message });
  }
});

/**
 * @api {get} /room/list List Rooms
 * @apiName room_list
 * @apiPermission None
 * @apiGroup Room
 * 
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "rooms": [
 *        {{room-placeholder}}
 *      ]
 *    }
 *
 * @apiError (Error 500) {String} error Possible value: 'databaseError', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "databaseError"
 *    }
 */
router.get('/list', async (req, res) => {
  try {
    const rooms = await act({ role: 'room', cmd: 'roomList', userId: req.user.id });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.details.message });
  }
});
export default router;