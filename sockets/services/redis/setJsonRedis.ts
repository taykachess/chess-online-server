import { redis } from "../../global/redis";

export function setJsonRedis({
  index,
  path,
  data,
}: {
  index: string;
  path: string;
  data: any;
}) {
  return redis.json.set(index, path, data);
}
