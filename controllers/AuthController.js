import dbClient from '../utils/db';
import express from 'express';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

async function generateAuthToken (req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  const base64cred = authHeader.split(' ')[1];
  const cred = Buffer.from(base64cred, 'base64').toString('utf-8');
  const [email, password] = cred.split(':');

  const hashedPassword = sha1(password);
  const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = uuidv4();
  const redisKey = `auth_${token}`;
  const userId = user._id.toString();

  await redisClient.set(redisKey, userId, 'EX', 24 * 60 * 60);

  return res.status(200).json({ token });
}

async function getUserFromToken (req, res) {
  const token = req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const redisKey = `auth_${token}`;
  const userId = await redisClient.get(redisKey);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  await redisClient.del(redisKey);

  return res.status(204).send();
}

const router = express.Router();

router.get('/connect', generateAuthToken);
router.get('/disconnect', getUserFromToken);

export default router;
