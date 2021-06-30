"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    type: 'sqlite',
    database: './db.sqlite',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};
exports.default = config;
//# sourceMappingURL=ormconfig.js.map