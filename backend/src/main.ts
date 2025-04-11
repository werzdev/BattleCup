import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://battlecup.werzdev.com'], // allow frontend to talk to backend
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
