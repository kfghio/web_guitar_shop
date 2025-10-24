import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as hbs from 'hbs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ElapsedTimeInterceptor } from './elapsed-time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT ?? 3000;
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const partialsPath = join(__dirname, '..', 'views/partials');
  console.log(`Registered partials path: ${partialsPath}`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  hbs.registerPartials(partialsPath);

  const publicPath = join(__dirname, '..', 'public');
  app.useStaticAssets(publicPath);
  console.log(`Serving static files from: ${publicPath}`);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  app.enableCors({
    origin: 'http://localhost:12345',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type, Accept', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ElapsedTimeInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Music Store API')
    .addBearerAuth()
    .setDescription('Документация API для музыкального магазина')
    .setVersion('1.0')
    .addTag('Brands - API', 'Управление брендами')
    .addTag('Categories - API', 'Управление категориями')
    .addTag('Products - API', 'Управление товарами')
    .addTag('Orders - API', 'Управление заказами')
    .addTag('Users - API', 'Управление пользователями')
    .addTag('Reviews - API', 'Управление отзывами')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.set('view options', { layout: 'main' });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
