import { Module } from '@nestjs/common'
import { GachaService } from './gacha.service'
import { GachaController } from './gacha.controller'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [BullModule.registerQueue({ name: 'gacha' })],
  controllers: [GachaController],
  providers: [GachaService]
})
export class GachaModule {}
