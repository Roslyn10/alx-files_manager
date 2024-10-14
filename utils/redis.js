// Simple interface that reacts with a redis database
const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor () {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
  }

  isAlive () {
    return this.client.connected;
  }

  async get (key) {
    return this.getAsync(key);
  }

  async set (key, value, duration) {
    this.client.setex(key, duration, value);
  }

  async del (key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
