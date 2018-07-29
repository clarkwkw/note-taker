import * as express from 'express';
import * as passport from 'passport';

import { act } from '../utils';
import { generateTokenMiddleware } from '../passport';

const router = express.Router();

/**
 * @api {post} /auth/me Get UserId by Token
 * @apiName user_me
 * @apiPermission None
 * @apiGroup Authentication
 *
 * @apiSuccess {String} user User Object
 */
router.post('/me', async (req, res) => {
  const userId = req.user.id;
  const user = await act({ role: 'auth', cmd: 'userRetrieve', userId });
  res.json(user);
});

/**
 * @api {post} /auth/login Login User
 * @apiName user_login
 * @apiPermission None
 * @apiGroup Authentication
 *
 * @apiSuccess {Object} user User Object
 * @apiSuccess {String} user.id User ID
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} token JWT token that can be placed in HEADER for authorization
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "user": {
 *        "id": "{{id-placeholder}}",
 *        "username": "isaac"
 *      },
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgzNjkzODUsImV4cCI6MTQ4ODM3NjU4NX0.-fNQqa3zJZaCPB14G4wd6PoZTg3FV7dATkf9LCS_Rxg"
 *    }
 *
 * @apiError (Error 500) {String} error Possible value: 'wrongPassword', 'invalidUser', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "wrongPassword"
 *    }
 */
router.post('/login',
  passport.authenticate('local', { session: false, failWithError: true }),
  generateTokenMiddleware,
  async (req: any, res) => {
    res.json({ user: req.user, token: req.token });
  }
);

/**
 * @api {post} /auth/signup Signup User
 * @apiName user_signup
 * @apiPermission None
 * @apiGroup Authentication
 *
 * @apiParam {String} username Username of the new user
 * @apiParam {String} password Password of the new user
 * @apiParam {String} email Email
 *
 * @apiUse objectId
 *
 * @apiError (Error 500) {String} error Possible value: 'alreadyExist', 'databaseError', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "alreadyExist"
 *    }
 */
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const { id } = await act({ role: 'auth', cmd: 'userCreate', username, password, email });
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.details.message });
  }
});

/**
 * @api {get} /auth/id/:userId Get User
 * @apiName user_get
 * @apiPermission None
 * @apiGroup Authentication
 *
 * @apiParam {String} userId Id of the user
 *
 * @apiSuccess {String} id User ID
 * @apiSuccess {String} username Username
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "{{id-placeholder}}",
 *      "username": "isaac"
 *    }
 *
 * @apiError (Error 500) {String} error Possible value: 'userNotExist', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "userNotExist"
 *    }
 */
router.get('/id/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await act({ role: 'auth', cmd: 'userRetrieve', userId });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.details.message });
  }
});

/**
 * @api {patch} /auth/id/:userId Patch User
 * @apiName user_patch
 * @apiPermission None
 * @apiGroup Authentication
 *
 * @apiParam {String} userId Id of the user
 * @apiParam {String} [password] New password
 * @apiParam {String} [email] Email
 *
 * @apiUse objectId
 *
 * @apiError (Error 500) {String} error Possible value: 'userNotExist', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "userNotExist"
 *    }
 */
router.patch('/id/:userId', async (req, res) => {
  const { userId } = req.params;
  const { password, email } = req.body;
  try {
    const id = await act({ role: 'auth', cmd: 'userPatch', userId, password, email });
    res.json(id);
  } catch(err) {
    res.status(500).json({ error: err.details.message });
  }
});

/**
 * @api {delete} /auth/id/:userId Delete User
 * @apiName user_delete
 * @apiPermission None
 * @apiGroup Authentication
 *
 * @apiParam {String} userId Id of the user
 *
 * @apiUse objectId
 *
 * @apiError (Error 500) {String} error Possible value: 'userNotExist', etc.
 * @apiErrorExample {json} Error-Response:
 *    {
 *      "error": "userNotExist"
 *    }
 */
router.delete('/id/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const id = await act({ role: 'auth', cmd: 'userDelete', userId });
    res.json(id);
  } catch(err) {
    res.status(500).json({ error: err.details.message });
  }
});

export default router;