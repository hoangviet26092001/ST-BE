import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';
import { Response } from 'express';
import { BaseService } from 'src/base.service';

@Injectable({})
export class AuthService extends BaseService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    super();
  }

  serverSecret = this.config.get('JWT_SECRET');

  async login(dto: AuthDTO, res: Response) {
    const { email, password } = dto;
    try {
      const holderUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!holderUser) throw new Error('Email or password incorrect');

      const { hash: userPassword, ...user } = holderUser;

      const pwMatches = await argon2.verify(userPassword, password);

      if (!pwMatches) throw new Error('Email or password incorrect');

      const token = await this.signToken(user.id, user.email);

      return this.onSuccess(res, user, { accessToken: token });
    } catch (error) {
      throw new ForbiddenException(error?.message || 'Something bad happened');
    }
  }

  async signup(dto: AuthDTO) {
    const { email, password } = dto;

    try {
      const holderUser = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (holderUser) throw new Error('Email already exist');

      const hash = await argon2.hash(password);

      const { hash: passwordHash, ...user } = await this.prisma.user.create({
        data: { email, hash },
      });

      return user;
    } catch (error) {
      throw new ForbiddenException(error?.message || 'Something bad happened');
    }
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.serverSecret,
    });

    return token;
  }
}
