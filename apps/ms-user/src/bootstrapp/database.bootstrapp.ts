import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '../env';
import path from 'node:path';

export class DataBaseBootstrapp {
  static dataSource: DataSource;
  initialize() {
    const options: DataSourceOptions = {
      type: env.DB_TYPE as any || "postgres",
      host: env.DB_HOST || "localhost",
      port: env.DB_PORT ? Number(env.DB_PORT) : 5434,
      username: env.DB_USER || "root",
      password: env.DB_PASS || "",
      database: env.DB_NAME || "test",
      entities: [
        path.join(__dirname, "../module/adapters/**/*.entity{.ts,.js}"),
      ],
      migrations: [],
      synchronize: env.DB_SYNC ? env.DB_SYNC === "true" : false,
      logging: env.DB_LOG ? env.DB_LOG === "true" : false,
      extra: {
        max: env.DB_POOL_SIZE ? Number(env.DB_POOL_SIZE) : 5,
      },
    };

    const app= new DataSource(options);
    DataBaseBootstrapp.dataSource = app;
    return app.initialize()
      .then(() => {
        return "Database connection established";
      })
      .catch((err) => {
        throw new Error(`Error connecting to the database: ${err.message}`);
      });
  }
}
