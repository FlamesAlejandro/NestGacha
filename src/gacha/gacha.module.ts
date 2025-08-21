import { Module } from '@nestjs/common'
import { GachaService } from './gacha.service'
import { GachaController } from './gacha.controller'
import { BullModule } from '@nestjs/bull'
import { BannersModule } from 'src/banners/banners.module'
import { CharactersModule } from 'src/characters/characters.module'
import { GachaTransactionalService } from './gacha.transactional'
import { RbacModule } from '@access/rbac.module'
import { MongooseModule } from '@nestjs/mongoose'
import { HttpModule } from '@nestjs/axios'
import {
  GachaExchange,
  GachaExchangeSchema,
  GachaHistory,
  GachaHistorySchema
} from '@common/schemas'
import { GachaProcessor } from './gacha.processor'
import { GachaQueueDebug } from './gacha.debug'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GachaExchange.name, schema: GachaExchangeSchema },
      { name: GachaHistory.name, schema: GachaHistorySchema }
    ]),
    HttpModule,
    RbacModule,
    BullModule.registerQueue({ name: 'gacha' }),
    BannersModule,
    CharactersModule
  ],
  controllers: [GachaController],
  providers: [
    GachaService,
    GachaTransactionalService,
    GachaProcessor,
    GachaQueueDebug
  ]
})
export class GachaModule {}
