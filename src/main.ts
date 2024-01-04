import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { applicationConfig } from 'config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix all api's with "api" keyword
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // Handle validation
  app.useGlobalPipes(new ValidationPipe());

  // Document API's using swagger
  const config = new DocumentBuilder()
    .setTitle('Backend Assessment')
    .addBearerAuth()
    .setDescription('The note sharing platform')
    .setVersion('1.0')
    .addTag('notes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Add CSP headers
  app.use(helmet());

  // Enable Cors
  app.enableCors();

  // Start the server
  const resp = await app.listen(applicationConfig.app.port);

  Logger.log(`Server is running on http://localhost:${resp.address().port}`)
  Logger.log(`Checkout the documentation at http://localhost:${resp.address().port}/api`)
}
bootstrap();
