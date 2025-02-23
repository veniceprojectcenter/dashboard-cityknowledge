const Redis = require('ioredis');
require('dotenv').config();

class RedisSingleton {
    static instance = null;
    client = null;

    constructor() {
        if (!RedisSingleton.instance) {
            const redisUrl = process.env.REDIS_URL;
            if (!redisUrl) {
                throw new Error('REDIS_URL is not defined in environment variables');
            }
            this.client = new Redis(redisUrl);
            RedisSingleton.instance = this;
        }
        return RedisSingleton.instance;
    }

    async setData(key,value,expirationInSeconds = 86400){
        await this.client.set(key,value,'EX',expirationInSeconds);
    }

    async getData(key){
        const cachedData = await this.client.get(key);
        return cachedData ? cachedData : null;
    }
}

module.exports = new RedisSingleton();
