import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from '@common/schemas'

@Injectable()
export class UsersSeeder {
  private readonly logger = new Logger(UsersSeeder.name)

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  private readonly data: Array<{
    email: string
    password: string
    name?: string
    role: string
    superAdmin?: boolean
    active?: boolean
  }> = [
    {
      email: 'super@local.test',
      password: 'Admin123',
      name: 'Super Admin',
      role: 'userAdmin',
      superAdmin: true
    },
    {
      email: 'gacha@local.test',
      password: 'Secret123',
      name: 'Gacha Mgr',
      role: 'gachaManager'
    },
    {
      email: 'editor@local.test',
      password: 'Secret123',
      name: 'Editor',
      role: 'contentEditor'
    },
    {
      email: 'viewer@local.test',
      password: 'Secret123',
      name: 'Viewer',
      role: 'viewer'
    },
    {
      email: 'user@local.test',
      password: 'Secret123',
      name: 'Usuario',
      role: 'user'
    }
  ]

  async drop() {
    const emails = this.data.map((d) => d.email)
    await this.userModel.deleteMany({ email: { $in: emails } })
    this.logger.warn(`users dropped: ${emails.join(', ')}`)
  }

  async seed() {
    for (const u of this.data) {
      const passwordHash = await bcrypt.hash(u.password, 12)
      await this.userModel
        .findOneAndUpdate(
          { email: u.email },
          {
            $set: {
              email: u.email,
              name: u.name,
              role: u.role,
              superAdmin: !!u.superAdmin,
              active: u.active ?? true,
              passwordHash
            }
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        .exec()
      this.logger.log(
        `user upserted: ${u.email} (role=${u.role}, superAdmin=${!!u.superAdmin})`
      )
    }
  }
}
