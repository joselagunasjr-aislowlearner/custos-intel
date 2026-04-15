import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const requiredEnvVars = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(helmet());

  // 10MB limit for photo uploads
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: [
      'https://joselagunasjr-aislowlearner.github.io',
      'https://custos-intel-production.up.railway.app',
            'https://custos-intel-production-b72f.up.railway.app',
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:5173', 'http://127.0.0.1:5173']
        : []),
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.setGlobalPrefix('api/v1');

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Custos Intel API')
      .setDescription('Fire & Life Safety Plan Review API')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Health check
  app.getHttpAdapter().get('/health', (_req: any, res: any) => {
    res.json({
      status: 'ok',
      service: 'custos-intel-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`Custos Intel API running on port ${port}`);
}

bootstrap();
