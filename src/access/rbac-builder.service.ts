import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RolesBuilder } from 'nest-access-control'
import { Role, RoleDocument } from '@common/schemas'

@Injectable()
export class RbacBuilderService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>
  ) {}

  async build(): Promise<RolesBuilder> {
    const rb = new RolesBuilder()
    const roles = await this.roleModel.find().lean().exec()

    for (const r of roles) {
      let g = rb.grant(r.key)
      for (const { module, actions } of r.grants ?? []) {
        const has = (a: 'create' | 'read' | 'update' | 'delete' | 'manage') =>
          actions.includes(a as any)
        const any = (v: 'create' | 'read' | 'update' | 'delete') =>
          has('manage') || has(v)
        if (any('create')) g = g.createAny(module)
        if (any('read')) g = g.readAny(module)
        if (any('update')) g = g.updateAny(module)
        if (any('delete')) g = g.deleteAny(module)
      }
    }
    return rb
  }
}
