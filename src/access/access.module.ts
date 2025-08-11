import { Module } from '@nestjs/common'
import { AccessService } from './access.service'
import { AccessController } from './access.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema, User, UserSchema } from 'src/common'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AccessController],
  providers: [AccessService]
})
export class AccessModule {}
