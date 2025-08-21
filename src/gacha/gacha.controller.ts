import { Controller } from '@nestjs/common'
import { GachaService } from './gacha.service'
import { PullDto } from './dtos/Pull.dto'

@Controller('gacha')
export class GachaController {
  constructor(private readonly gachaService: GachaService) {}

  gachaPull(dto: PullDto): Promise<any> {
    return this.gachaService.createQueue(dto)
  }
}
