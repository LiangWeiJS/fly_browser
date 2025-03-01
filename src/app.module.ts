import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OnlineModule } from './online/online.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [OnlineModule,TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'online',
    password: '123456',
    database: 'online',
    synchronize: true,
    autoLoadEntities: true, 
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
