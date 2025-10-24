import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UnauthorizedRedirectFilter } from '../auth/unauthorized-redirect.filter';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('auth')
@UseFilters(UnauthorizedRedirectFilter)
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('login')
  @Render('auth')
  loginPage() {
    return {
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
      title: 'Авторизация',
    };
  }

  @Post('verify')
  @UseGuards(FirebaseAuthGuard)
  verify(@Req() req: Request) {
    console.log(req);
    return { message: 'Вы успешно вошли', user: req['user'] };
  }

  @Get('register')
  @Render('reg')
  regPage() {
    return {
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
      title: 'Регистрация',
    };
  }

  @Post('register')
  @Redirect()
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      rpassword: string;
      firstName: string;
      lastName: string;
    },
  ) {
    const { email, password, rpassword, firstName, lastName } = body;

    if (password !== rpassword) {
      return { url: '/auth/register?error=1' };
    }

    try {
      const createUserDto = {
        email,
        password,
        role: { name: 'user' },
        profile: {
          firstName: firstName,
          lastName: lastName,
        },
      };

      await this.usersService.createUser(createUserDto);
      return { url: '/' };
    } catch (e) {
      console.error('Error creating user:', e);
      throw new BadRequestException('Ошибка регистрации');
    }
  }
}
