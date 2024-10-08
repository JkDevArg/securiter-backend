import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigsDto } from "./dto/configs.dto";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { Configs } from "./entities/configs.entity";


@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Configs)
        private readonly configsRepository: Repository<Configs>
    ){}

    async setSettings(configsDto: ConfigsDto, user: UserActiveInterface){
        return this.configsRepository.save({
            ...configsDto,
            userEmail: user.email
        });
    }

    async getSettings() {
        return this.configsRepository.find();
    }

    async getSettingsByName(module: string) {
        return this.configsRepository.findOneBy({
            module: module
        });
    }
}