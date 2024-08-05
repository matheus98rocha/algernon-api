import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import helmet from 'helmet';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://algernon-ui.vercel.app/'],
  });
  app.use(helmet());
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
