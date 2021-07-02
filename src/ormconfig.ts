import { ConnectionOptions } from "typeorm";


const config: ConnectionOptions = {
    type: 'sqlite',
    database: './db.sqlite',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
    },
}

export default config;