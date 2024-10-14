import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const userExists = await dbClient.db().collection('users').findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = sha1(password);
      const newUser = {
        email,
        password: hashedPassword,
      };

      const result = await dbClient.db().collection('users').insertOne(newUser);

      return res.status(201).json({
        id: result.insertedId,
        email,
      });

    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
	async function getUserProfile(req, res) {
		const token = req.header['x-token'];

		if (!token) {
			return res.status(401).json({ error: "Missing token" });
		}

		const rediskey = `auth_${token}`;
		const userId = await redisClient.get(rediskey);

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const user = await dbClient.db.collection('users').findOne({_id: dbClient.Object(userId) });

		if (!user) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		
		return res.status(200).json({
			id: user._id.toString(),
			email: user.email,
		});
	}
}

export default UsersController;
