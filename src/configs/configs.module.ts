import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Configs } from "./entities/configs.entity";
import { User } from "src/users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Configs, User])],
    controllers: [],
    providers: [ConfigService]
})
export class ConfigsModule {}