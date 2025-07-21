import redis from '../../utils/redis';

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  if (!cached) return null;
  return JSON.parse(cached);
}

export async function setCache<T>(key: string, data: T, ttlSeconds = 3600) {
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
}

export async function deleteCache(key: string) {
  await redis.del(key);
}

export async function flushAllCache() {
  const keys = await redis.keys('cache:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
