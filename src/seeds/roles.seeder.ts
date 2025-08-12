import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from '@common/schemas'
import { ModuleKey, Action } from '@common/enums'

@Injectable()
export class RolesSeeder {
  private readonly logger = new Logger(RolesSeeder.name)

  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>
  ) {}

  private readonly data: Array<{
    key: string
    label: string
    grants: { module: ModuleKey; actions: Action[] }[]
  }> = [
    {
      key: 'userAdmin',
      label: 'User Admin',
      grants: [
        { module: ModuleKey.Users, actions: ['manage'] },
        { module: ModuleKey.Roles, actions: ['manage'] },
        { module: ModuleKey.Gachas, actions: ['read'] },
        { module: ModuleKey.Characters, actions: ['read'] },
        { module: ModuleKey.Histories, actions: ['read'] }
      ]
    },
    {
      key: 'gachaManager',
      label: 'Gacha Manager',
      grants: [
        { module: ModuleKey.Gachas, actions: ['manage'] },
        { module: ModuleKey.Characters, actions: ['create', 'read', 'update'] },
        { module: ModuleKey.Histories, actions: ['read'] }
      ]
    },
    {
      key: 'contentEditor',
      label: 'Content Editor',
      grants: [
        { module: ModuleKey.Histories, actions: ['manage'] },
        { module: ModuleKey.Characters, actions: ['create', 'read', 'update'] },
        { module: ModuleKey.Gachas, actions: ['read'] }
      ]
    },
    {
      key: 'viewer',
      label: 'Viewer',
      grants: [
        { module: ModuleKey.Gachas, actions: ['read'] },
        { module: ModuleKey.Characters, actions: ['read'] },
        { module: ModuleKey.Histories, actions: ['read'] }
      ]
    },
    {
      key: 'user',
      label: 'Usuario General',
      grants: [
        { module: ModuleKey.Gachas, actions: ['read'] },
        { module: ModuleKey.Characters, actions: ['read'] }
      ]
    }
  ]

  async drop() {
    const keys = this.data.map((d) => d.key)
    await this.roleModel.deleteMany({ key: { $in: keys } })
    this.logger.warn(`roles dropped: ${keys.join(', ')}`)
  }

  async seed() {
    for (const r of this.data) {
      await this.roleModel
        .findOneAndUpdate({ key: r.key }, r, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        })
        .exec()
      this.logger.log(`role upserted: ${r.key}`)
    }
  }
}
