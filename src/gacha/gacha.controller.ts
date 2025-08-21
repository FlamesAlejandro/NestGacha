import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { GachaService } from './gacha.service'
import { FullPullDto, PullDto } from './dtos/Pull.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AuthUser, JwtPayload } from 'src/auth/auth-user.decorator'

@Controller('gacha')
export class GachaController {
  constructor(private readonly gachaService: GachaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('pull')
  gachaPull(@AuthUser() user: JwtPayload, @Body() dto: PullDto): Promise<any> {
    const fullDto: FullPullDto = { ...dto, userId: user.sub }
    return this.gachaService.createQueue(fullDto)
  }
}
