import dotenv from "dotenv";
dotenv.config();

type Config = {
  username: string;
  password: string;
  database: string;
  host: string;
  [key: string]: string;
};

interface IConfigGroup {
  development: Config;
  test: Config;
  production: Config;
}

const config: IConfigGroup = {
  development: {
    username: process.env.DB_ACCOUNT!,
    password: process.env.DB_PASSWORD!,
    database: "joel-personal-dev",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_ACCOUNT!,
    password: process.env.DB_PASSWORD!,
    database: "joel-personal-test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_ACCOUNT!,
    password: process.env.DB_PASSWORD!,
    database: "joel-personal-prod",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

export default config;
