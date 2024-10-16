import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async generateAuthToken(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Missing credentials' });
    }

    const base64cred = authHeader.split(' ')[1];
    const cred = Buffer.from(base64cred, 'base64').toString('utf-8');
    const [email, password] = cred.split(':');

    const hashedPassword = sha1(password);
    const collection = await dbClient.userCollection();
    const user = await collection.findOne({ email, password: hashedPassword });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = uuidv4();
    const redisKey = `auth_${token}`;
    await redisClient.set(redisKey, user._id.toString(), 'EX', 86400);

    return res.status(200).json({ token });
  }
}

export default AuthController;

