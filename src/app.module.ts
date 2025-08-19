import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './connections/mongo.connection.import'
import { RbacModule } from '@access/rbac.module'
import { GachaModule } from './gacha/gacha.module'
import { BullModule } from '@nestjs/bull'
import { CharactersModule } from './characters/characters.module';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 5000
      }
    }),
    DatabaseModule,
    RbacModule,
    AuthModule,
    UsersModule,
    GachaModule,
    CharactersModule,
    BannersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
