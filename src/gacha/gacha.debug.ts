// src/gacha/gacha.debug.ts
import { InjectQueue } from '@nestjs/bull'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class GachaQueueDebug implements OnModuleInit {
  constructor(@InjectQueue('gacha') private readonly q: Queue) {}

  onModuleInit() {
    this.q.on('error', (err) => console.error('[gacha] error', err?.message))
    this.q.on('waiting', (jobId) => console.log('[gacha] waiting', jobId))
    this.q.on('active', (job) => console.log('[gacha] active', job.id))
    this.q.on('completed', (job) => console.log('[gacha] completed', job.id))
    this.q.on('failed', (job, err) =>
      console.error('[gacha] failed', job?.id, err?.message)
    )
  }
}
