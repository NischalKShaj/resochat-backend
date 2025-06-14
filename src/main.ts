import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

declare const module: any;

class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.FRONTEND_BASE_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      allowEIO3: true
    });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 5000;
  const frontendUrl = configService.get('FRONTEND_BASE_URL');

  // Enable CORS for HTTP
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Use custom WebSocket adapter
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`WebSocket server running on: ws://localhost:${port}/notifications`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
