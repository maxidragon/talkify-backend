import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { sha512 } from 'js-sha512';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async isTaken(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email: email } });
    return !!user;
  }

  async signup(dto: RegisterDto): Promise<object> {
    const sampleUser = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (sampleUser) throw new ForbiddenException('Credentials taken!');
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: sha512(dto.password),
        username: dto.username,
      },
    });
    //TODO
    //send verification email
    return { msg: 'Successfully registered a new account!' };
  }

  async login(dto: LoginDto): Promise<[string, string, object]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: dto.email },
    });

    if (sha512(dto.password) === user.password) {
      return this.generateAuthCookie({ userId: user.id });
    }
    throw new ForbiddenException('Wrong credentials!');
  }

  async generateAuthJwt(payload: JwtAuthDto): Promise<string> {
    console.log('payload: ', payload);
    return this.jwtService.sign(payload);
  }

  async generateAuthCookie(
    payload: JwtAuthDto,
  ): Promise<[string, string, object]> {
    const jwt = await this.generateAuthJwt(payload as JwtAuthDto);
    return ['jwt', jwt, { secure: false, sameSite: 'None' }];
  }

  async getUserPublicInfo(email: string): Promise<object | null> {
    const { prisma } = this;
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }
}
