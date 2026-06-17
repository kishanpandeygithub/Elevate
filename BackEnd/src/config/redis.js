const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-17472.crce310.us-east-1-6.ec2.cloud.redislabs.com',
        port: 17472
    }
});

module.exports =redisClient;
