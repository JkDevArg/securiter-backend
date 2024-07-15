import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { BaseEntityState } from 'src/common/entities/base.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly entityManager: EntityManager,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    const isLocked = (
      await this.entityManager.query('CALL CheckIfUserLocked(?, @is_locked)', [username])
    )[0][0].is_locked;

    if (isLocked)
      throw new UnauthorizedException(
        'You are blocked, temporary',
      );

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      await this.entityManager.query('CALL IncrementLoginAttempts(?)', [username]);
      throw new UnauthorizedException('Incorrect');
    }

    await this.entityManager.query('CALL ResetLoginAttempts(?)', [username])

    return user;
  }
}
