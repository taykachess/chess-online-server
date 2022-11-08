import { redis } from "../../global/redis";

export function delJsonRedis({ index, path }: { index: string; path: string }) {
  return redis.json.del(index, path);
}
