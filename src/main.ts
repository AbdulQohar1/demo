import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  SwaggerModule, DocumentBuilder } from  '@nestjs/swagger'
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Demo app')
    .setDescription('A nest.js post application built with dataui/crud library')
    .setVersion('1.0')
    .addTag('posts')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
