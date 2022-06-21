import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../database/database.service';
import { Request } from 'express';

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService, private readonly db: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('RT_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: number; email: string; username: string },
  ) {
    const user = await this.db.user.findUnique({ where: { id: payload.sub } });
    delete user.passwordHash;
    return user;
  }
}
