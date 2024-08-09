import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "./entities/log.entity";
import { Repository } from "typeorm";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { Role } from "src/common/enums/rol.enum";

@Injectable()
export class LogService {

    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ){}

    async registerLog(data: any, module: string, user: UserActiveInterface, old_credits: number, new_credits: number, credits_used: number) {
        const saveStore = {
            module,
            data: JSON.stringify(data),
            userEmail: user.email,
            is_admin: user.role == Role.ADMIN,
            old_credits: old_credits,
            actual_credits: new_credits,
            credits_used: credits_used
        };

        return this.logRepository.save(saveStore);
    }
}