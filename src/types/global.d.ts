declare interface IEnv {
  BASE_URL: string;
  REDIS_DB: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}
declare interface IEnvs {
  [key: string]: IEnv;
}

export { IEnv, IEnvs };
