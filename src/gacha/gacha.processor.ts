import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { GachaService } from './gacha.service'

@Processor('gacha')
export class GachaProcessor {
  constructor(private readonly gachaService: GachaService) {}

  // Job en segundo plano
  @Process('processGacha')
  async handlePull(job: Job<any>): Promise<void> {
    try {
      await this.gachaService.handlePullRequest(job.data)
    } catch (error) {
      console.log(error)
    }
  }
}
