import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Event } from './events/event.entity';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nest',
      password: 'nest',
      database: 'nest_events',
      entities: [User, Event],
      synchronize: true, //
    }),
    TypeOrmModule.forFeature([User, Event]), // optional if used globally
    UsersModule,
    EventsModule,
  ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}
