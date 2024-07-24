import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { V4 as PasetoV4 } from 'paseto';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { Repository } from 'typeorm';
import { generateKey } from 'src/utils/generateKey';
import { LoginDto } from './dto/login.dto';
import { updateEnvVariable } from 'src/utils/updateEnv';
import { comparePasswords } from 'src/helpers/password';
import { CreditsService } from 'src/credits/credits.service';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
    private readonly secretKey: Buffer;

    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Settings)
        private readonly settingsRepository: Repository<Settings>,
        private readonly creditsService: CreditsService
    ) { }

    async register({ name, email, password }: RegisterDto) {
        const user = await this.usersService.findOneByEmail(email);

        if (user) {
            throw new BadRequestException('User already exists');
        }

        await this.usersService.create({
            name,
            email,
            password: await bcryptjs.hash(password, 10)
        });

        // Creamos los creditos asignando al usuario que se registra
        this.creditsService.create(email);

        return {
            status: 200,
            data: {
                'name': name,
                'email': email,
                'credits': 100
            }
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmailWithPassword(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('User or password invalid');
        }

        const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('User or password invalid');
        }

        const userCredits = user.credits.reduce((total, credit) => total + credit.credits, 0);

        const payload = { email: user.email, role: user.role, credits: userCredits };

        try {
            // Obtener la clave privada en formato Buffer
            const privateKey = await this.getPrivateKey();

            const encodedKey = Buffer.from(privateKey).toString('base64');
            updateEnvVariable('SECRET_TOKEN_KEY', encodedKey);

            // Firmar el token PASETO
            const accessToken = await PasetoV4.sign(payload, privateKey, { expiresIn: '2h' });

            return {
                user: {
                    email: user.email,
                    role: user.role,
                    credits: userCredits
                },
                backendTokens: {
                    accessToken,
                    expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
                },
            };
        } catch (error) {
            throw new Error(`Failed to sign token: ${error.message}`);
        }
    }

    async refreshToken(email: string) {
        const user = await this.usersService.findByEmailWithPassword(email);
        const payload = { email: user.email, role: user.role };

        const accessToken = await PasetoV4.sign(payload, this.secretKey, { expiresIn: '2h' });

        return {
            accessToken,
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
        };
    }

    async profile({ email }: { email: string }) {
        return await this.usersService.findOneByEmail(email);
    }

    async getPrivateKey(): Promise<string> {
        const key = await this.settingsRepository.findOne({ where: { name: 'apirest' } });
        if (!key) {
            const newKey = generateKey();
            // Guarda la nueva clave en la base de datos
            const newSettings = this.settingsRepository.create({ privateKey: newKey, name: 'apirest' });
            await this.settingsRepository.save(newSettings);

            return newKey;
        }

        return key.privateKey;
    }

    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findOneByEmail(username);

        if (!user) return null;

        const passOk = await comparePasswords(pass, user.password);

        if (!passOk) return null;

        delete user.password;

        return user;
    }

    /* async removeToken(token: string, forever: boolean = false) {
        const _token = await this.tokensRepository.findOneBy({ token });

        if (!_token) return;

        _token.state = BaseEntityState.DELETED;
        _token.date_deleted = getSystemDatetime();

        await this.tokensRepository.save(_token);
    }

    async removeExpiredTokens() {
        await this.tokensRepository
          .createQueryBuilder()
          .update()
          .set({
            state: BaseEntityState.DELETED,
            date_deleted: getSystemDatetime(),
          })
          .where('date_expiration < NOW()')
          .andWhere('state = :state', { state: BaseEntityState.ENABLED })
          .execute();
      }

        async isTokenInBlackList(token: string): Promise<boolean> {
            const _token = await this.tokensRepository.findOne({
            where: { token: token, state: BaseEntityState.ENABLED },
            });

            return !_token;
        }

        async validateToken(token: string) {
            const payload = await this.getPayloadFromToken(token);
            if (!payload) throw new UnauthorizedException('El token ha expirado o es invalido');

            const isInBlackList = await this.isTokenInBlackList(token);
            if (isInBlackList)
            throw new BadRequestException('El token ya ha sido utilizado');
        }

      */
}
