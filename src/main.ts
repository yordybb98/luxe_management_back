import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // COOKIE
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        ['http://localhost:3000', 'http://localhost:4000'].includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // PORT
  const port = process.env.PORT || 3000;

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Luxe Graphics Process Management API')
    .setDescription(
      'API documentation for the process management system at Luxe Graphics',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  console.log('Server running on port', port);
  await app.listen(port);
}
bootstrap();
