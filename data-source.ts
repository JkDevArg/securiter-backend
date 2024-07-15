import { Settings } from "src/auth/entities/settings.entity";
import { Configs } from "src/configs/entities/configs.entity";
import { Credit } from "src/credits/entities/credit.entity";
import { Log } from "src/logs/entities/log.entity";
import { Store } from "src/phone/entities/validate.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: 'mysql',
    host: "localhost",
    port: 3309,
    username: "root",
    password: "Twr9YV5NB@Fby7!2",
    database: "db_app",
    synchronize: false,
    entities: [
        Configs,
        User,
        Credit,
        Store,
        Log,
        Settings
    ],
    migrations: ['migrations/*.ts'],
  });

  export default AppDataSource;
