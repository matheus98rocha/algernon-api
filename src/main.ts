import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
