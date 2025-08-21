// procesador debe escuchar la cola y ejecutar las tareas en segundo plano.
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { GachaService } from './gacha.service'

@Processor('gacha')
export class GachaProcessor {
  constructor(private readonly gachaService: GachaService) {}

  // Job en segundo plano
  @Process('processPulls')
  async handlePull(job: Job<any>): Promise<void> {
    await this.gachaService.handlePullRequest(job.data)
  }
}
