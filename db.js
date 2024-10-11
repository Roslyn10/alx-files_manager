const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const database = process.env.DB_DATABASE || 'files_manager';

class DBClient {
    constructor() {
        // Create a MongoDB client using the connection string
        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = null;

        // Connect to the database
        this.client.connect().then(() => {
            this.db = this.client.db(database);
            console.log('Connected to MongoDB');
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
        });
    }

    // Check if the connection to MongoDB is alive
    isAlive() {
        return this.client.topology && this.client.topology.isConnected();
    }

    // Get the number of documents in the 'users' collection
    async nbUsers() {
        if (!this.db) return 0;
        return this.db.collection('users').countDocuments();
    }

    // Get the number of documents in the 'files' collection
    async nbFiles() {
        if (!this.db) return 0;
        return this.db.collection('files').countDocuments();
    }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;

