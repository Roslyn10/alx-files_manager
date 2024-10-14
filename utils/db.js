import { MongoClient } from 'mongodb';

class DBClient {
	const host = process.env.DB_HOST || 'locahost';
	const port = process.env.DB_PORT || '27017';
	const database = process.env.DB_DATABASE || 'files_manger';
  constructor () {
    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, { userNewUrlParser: true, useUnifiedTopology: true });
    this.db = null;

    this.client.connect().then(() => {
      this.db = this.client.db(database);
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
    });
  }

  isAlive () {
    return !!this.db;
  }

  async nbUSers () {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles () {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
