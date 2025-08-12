import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from '@common/schemas'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto'
import { ChangePasswordDto } from './dtos/change-password.dto'
import { UpdateUserRoleDto } from './dtos/update-user-role.dto'

type UserLean = Omit<User, 'passwordHash'> & { _id: Types.ObjectId }
type UserResponse = Omit<User, 'passwordHash'> & { id: string }

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const exists = await this.userModel.exists({ email: dto.email })
    if (exists) throw new ConflictException('Email ya registrado')
    const passwordHash = await bcrypt.hash(dto.password, 12)
    const doc = await this.userModel.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: dto.role ?? 'user',
      superAdmin: dto.superAdmin ?? false
    })
    return doc.toObject<UserResponse>()
  }

  async findAll(
    page = 1,
    limit = 20
  ): Promise<{
    items: UserResponse[]
    total: number
    page: number
    limit: number
  }> {
    const skip = (Math.max(page, 1) - 1) * Math.max(limit, 1)

    const [rows, total] = await Promise.all([
      this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<UserLean[]>()
        .exec(),
      this.userModel.countDocuments().exec()
    ])

    const items: UserResponse[] = rows.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...(rest as Omit<User, 'passwordHash'>)
    }))

    return { items, total, page, limit }
  }

  async findById(id: string): Promise<UserResponse> {
    const doc = await this.userModel.findById(id).exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')
    return doc.toObject<UserResponse>()
  }

  async updateProfile(
    id: string,
    dto: UpdateUserProfileDto
  ): Promise<UserResponse> {
    if (dto.email) {
      const clash = await this.userModel.exists({
        _id: { $ne: id },
        email: dto.email
      })
      if (clash) throw new ConflictException('El email ya está en uso')
    }
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: { ...dto } }, { new: true })
      .exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')
    return doc.toObject<UserResponse>()
  }

  async changePassword(
    id: string,
    dto: ChangePasswordDto
  ): Promise<UserResponse> {
    const doc = await this.userModel.findById(id).select('+passwordHash').exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')

    if (dto.currentPassword) {
      const ok = await bcrypt.compare(dto.currentPassword, doc.passwordHash)
      if (!ok) throw new UnauthorizedException('Contraseña actual incorrecta')
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12)
    doc.passwordHash = passwordHash
    await doc.save()
    return doc.toObject<UserResponse>()
  }

  async deactivateById(id: string): Promise<UserResponse> {
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: { active: false } }, { new: true })
      .exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')
    return doc.toObject<UserResponse>()
  }

  async reactivateById(id: string): Promise<UserResponse> {
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: { active: true } }, { new: true })
      .exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')
    return doc.toObject<UserResponse>()
  }

  async updateRoleFlags(
    id: string,
    dto: UpdateUserRoleDto
  ): Promise<UserResponse> {
    const patch: Record<string, any> = {}
    if (dto.role !== undefined) patch.role = dto.role
    if (dto.superAdmin !== undefined) patch.superAdmin = dto.superAdmin
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')
    return doc.toObject<UserResponse>()
  }

  async updateById(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const update: Record<string, any> = { ...dto }
    if (dto.password) {
      update.passwordHash = await bcrypt.hash(dto.password, 12)
      delete update.password
    }
    const doc = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')
    return doc.toObject<UserResponse>()
  }

  async removeById(id: string): Promise<UserResponse> {
    const doc = await this.userModel.findByIdAndDelete(id).exec()
    if (!doc) throw new NotFoundException('Usuario no encontrado')
    return doc.toObject<UserResponse>()
  }
}
