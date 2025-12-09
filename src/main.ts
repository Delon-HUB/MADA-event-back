import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', credentials: true });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  const logger = new Logger(AppModule.name);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
