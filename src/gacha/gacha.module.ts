import { Module } from '@nestjs/common'
import { GachaService } from './gacha.service'
import { GachaController } from './gacha.controller'
import { BullModule } from '@nestjs/bull'
import { BannersModule } from 'src/banners/banners.module'
import { CharactersModule } from 'src/characters/characters.module'
import { GachaTransactionalService } from './gacha.transactional'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'gacha' }),
    BannersModule,
    CharactersModule
  ],
  controllers: [GachaController],
  providers: [GachaService, GachaTransactionalService]
})
export class GachaModule {}
