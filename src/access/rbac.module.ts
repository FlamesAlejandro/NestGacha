import { Module } from '@nestjs/common'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { AccessControlModule, RolesBuilder } from 'nest-access-control'
import { Role, RoleSchema, RoleDocument } from '@common/schemas'
import { Model } from 'mongoose'

const ROLES_BUILDER_TOKEN = 'ROLES_BUILDER' as const

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    AccessControlModule
  ],
  providers: [
    {
      provide: ROLES_BUILDER_TOKEN,
      useFactory: async (roleModel: Model<RoleDocument>) => {
        const rb = new RolesBuilder()
        const roles = await roleModel.find().lean().exec()
        for (const r of roles) {
          let g = rb.grant(r.key)
          for (const { module, actions } of r.grants ?? []) {
            const has = (
              a: 'create' | 'read' | 'update' | 'delete' | 'manage'
            ) => actions.includes(a)
            const any = (verb: 'create' | 'read' | 'update' | 'delete') =>
              has('manage') || has(verb)
            if (any('create')) g = g.createAny(module)
            if (any('read')) g = g.readAny(module)
            if (any('update')) g = g.updateAny(module)
            if (any('delete')) g = g.deleteAny(module)
          }
        }
        return rb
      },
      inject: [getModelToken(Role.name)]
    }
  ],
  exports: [AccessControlModule]
})
export class RbacModule {}
