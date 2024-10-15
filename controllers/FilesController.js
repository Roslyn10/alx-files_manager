import redicClient from '../utils/redis';
import dbClient from '../utils/db';

export default class FilesController {
	static postfiles(req) {
		const token = req.header('x-token');
		const rediskey = `auth_${token}`;
		const userID = await redisClient.get(key);
		if (userId) {
			const users = dbClient.db.collection('users');
			const object_id = new ObjectId(userId);
			onst user = await users.findOne({ _id: object_id });
			if(!user) {
				return null;
			}
			return user;
		}
		return null;
	}
	
	static async postUpload(req, res) {
		const user = await FilesCOntroller.getUser(req);
		if(!user) {
			return reponse.status(401).json({ error: 'Unauthorized' });
		}

