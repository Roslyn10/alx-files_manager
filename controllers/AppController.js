import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
	static getStatus(req, res) {
		const redisAlive = redisClient.isAlive();
		const dbAlive = dbClient.isAlive();

		res.status(200).json({
			redis: redisAlive,
			db: dbAlive
		});
	}

	static async getSats(req, res) {
		const numberOfUsers = await dbClient.nbUsers();
		const numberofFiles = await dbClient.nbFiles();

		res.status(200).json({
			users: numberofUsers,
			files: numberofFiles
		});
	}
}
module.exports = AppController;
