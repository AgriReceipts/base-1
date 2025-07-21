import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.log('Redis connection error', err));

export default redis;
