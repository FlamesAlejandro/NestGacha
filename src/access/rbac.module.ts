import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccessControlModule } from 'nest-access-control'
import { Role, RoleSchema } from '@common/schemas'
import { SuperACGuard } from './super-ac.guard'
import { RbacBuilderService } from './rbac-builder.service'

const ROLES_BUILDER_TOKEN = '__roles_builder__' as const

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    AccessControlModule
  ],
  providers: [
    RbacBuilderService,
    {
      provide: ROLES_BUILDER_TOKEN,
      useFactory: async (svc: RbacBuilderService) => svc.build(),
      inject: [RbacBuilderService]
    },
    SuperACGuard
  ],
  exports: [AccessControlModule, ROLES_BUILDER_TOKEN, SuperACGuard]
})
export class RbacModule {}
