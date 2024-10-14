import dbClient from '../utils/db';
import express from 'express';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redicClient from '../utils/redis';

async function generateAuthToken(req, res) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: "Missing credentials" });
	}

	const base64cred = authHeader.split(' ')[1];
	const cred = Buffer.from(base64cred, 'base64').toString('utf-8');
	const [ email, password] = cred.split(':');

	const hashedpassword = sha1(password);
	const user = await dbClient.db.collection('users').findOne({ email, password: hashedpassword });

	if (!user) {
		return res.status(401).json({ error: "Invalid email or password" });
	}

	const token = uuidv4();

	const rediskey = `auth_${token}`;
	const userId = user._id;
	await redisClient.set(rediskeu, userId.toString(), 'EX', 24 * 60 * 60);

	return res.status(200).json({ token });
}

const router = express.Router();

router.get('/conect', generateAuthToken);

export default router;

