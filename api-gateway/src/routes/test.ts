import * as express from 'express';
import * as passport from 'passport';

import { act } from '../utils';

const router = express.Router();

/**
 * @api {get} /test Test backend connection
 * @apiName Test
 * @apiPermission User
 * @apiGroup Test
 *
 * @apiSuccess {String} status Status, only having an 'ok' value.
 */
router.get('/', async (req, res) => {
  try {
    let analyzer = await act({ role: 'analyzer', cmd: 'test' });
    let auth = await act({ role: 'auth', cmd: 'test' });
    let room = await act({ role: 'room', cmd: 'test' });

    res.json({ analyzer, auth, room});

  } catch (e) {
    res.json({ status: 'error' });
  }
});

export default router;