import Redis from 'ioredis';

const redis = new Redis({});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.log('Redis connection error', err));

export default redis;
