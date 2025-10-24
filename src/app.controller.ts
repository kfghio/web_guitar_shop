import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductsService } from './products/products.service';
import { BrandsService } from './brands/brands.service';
import { CategoriesService } from './categories/categories.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  private validUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' },
  ];
  constructor(private readonly appService: AppService) {}
  private checkAuth(
    username: string | undefined,
    password: string | undefined,
  ): boolean {
    return this.validUsers.some(
      (user) => user.username === username && user.password === password,
    );
  }
  @Get('/')
  @Render('index')
  root(
    @Query() query: { username?: string; password?: string; logout?: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const isAuthenticated = this.checkAuth(query.username, query.password);
    const isLogout = query.logout === 'true';

    return {
      title: 'Магазин гитар',
      cssFile: 'outlines.css',
      body: 'indexBody',
      isAuthenticated: isLogout ? false : isAuthenticated,
      username: query.username,
      additionalScripts: ['/scripts/auth.js'],
    };
  }

  @Get('/guitars')
  @Render('index')
  guitars() {
    return {
      title: 'Товары',
      cssFile: 'outlines.css',
      body: 'indexBody',
    };
  }

  @Get('/debug')
  getDebug() {
    return {
      message: 'Работает!',
      body: 'acousticBody',
    };
  }

  @Get('/acoustic')
  @Render('partials/acousticBody')
  acoustic() {
    return {
      title: 'Аккустические гитары',
      cssFile: 'accoustic.css',
      body: 'partials/acousticBody',
      additionalScripts: ['scripts/preload.js'],
    };
  }

  @Get('/about')
  @Render('partials/aboutBody')
  about() {
    return {
      title: 'О нас',
      cssFile: 'accoustic.css',
      body: 'aboutBody',
      additionalScripts: [
        'https://code.jquery.com/jquery-3.6.0.min.js',
        'fake/sly.min.js',
        'scripts/scroll.js',
      ],
    };
  }

  @Get('/electric')
  @Render('partials/electricBody')
  electric() {
    return {
      title: 'Электрогитары',
      cssFile: 'accoustic.css',
      body: 'electricBody',
    };
  }
  @Get('/services')
  @Render('partials/servicesBody')
  services() {
    return {
      title: 'Сервисы',
      cssFile: 'accoustic.css',
      body: 'servicesBody',
      additionalScripts: [
        'https://cdnjs.cloudflare.com/ajax/libs/vex-js/4.1.0/js/vex.combined.min.js',
      ],
    };
  }
  @Get('/schedule')
  @Render('partials/scheduleBody')
  schedule() {
    return {
      title: 'коснструктор расписания',
      cssFile: 'accoustic.css',
      body: 'scheduleBody',
      additionalScripts: ['/scripts/schedule.js'],
    };
  }
  @Get('/affairs')
  @Render('partials/affairsBody')
  affairs() {
    return {
      title: 'коснструктор расписания',
      cssFile: 'accoustic.css',
      body: 'affairsBody',
      additionalScripts: ['/scripts/affair.js'],
    };
  }
  @Get('/contact')
  @Render('partials/contactBody')
  contact() {
    return {
      title: 'контакты',
      cssFile: 'accoustic.css',
      body: 'contactBody',
    };
  }
}
