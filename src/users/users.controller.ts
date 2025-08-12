// src/users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UseRoles } from 'nest-access-control'
import { ModuleKey } from '@common/enums'
import { UsersService } from './users.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto'
import { ChangePasswordDto } from './dtos/change-password.dto'
import { UpdateUserRoleDto } from './dtos/update-user-role.dto'
import { SuperACGuard } from '@access/super-ac.guard'
import { UpdateUserDto } from './dtos/update-user.dto'

@UseGuards(JwtAuthGuard, SuperACGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseRoles({ resource: ModuleKey.Users, action: 'create', possession: 'any' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto)
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'read', possession: 'any' })
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.users.findAll(Number(page), Number(limit))
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'read', possession: 'any' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findById(id)
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'update', possession: 'any' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.updateById(id, dto)
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'update', possession: 'any' })
  @Patch(':id/profile')
  updateProfile(@Param('id') id: string, @Body() dto: UpdateUserProfileDto) {
    return this.users.updateProfile(id, dto)
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'update', possession: 'any' })
  @Patch(':id/password')
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.users.changePassword(id, dto)
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'delete', possession: 'any' })
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.users.deactivateById(id)
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'update', possession: 'any' })
  @Patch(':id/activate')
  reactivate(@Param('id') id: string) {
    return this.users.reactivateById(id)
  }

  @UseRoles({ resource: ModuleKey.Users, action: 'update', possession: 'any' })
  @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.users.updateRoleFlags(id, dto)
  }
}
