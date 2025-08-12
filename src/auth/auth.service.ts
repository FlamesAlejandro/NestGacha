// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User, UserDocument } from '@common/schemas'
import { RegisterDto, LoginDto } from './dtos/auth.dto'

type UserResponse = Omit<User, 'passwordHash'> & { id: string }

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwt: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.exists({ email: dto.email })
    if (exists) throw new ConflictException('Email ya registrado')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const doc = await this.userModel.create({
      email: dto.email,
      passwordHash,
      role: dto.role ?? 'user',
      name: dto.name
    })

    const user = doc.toObject<UserResponse>()
    return {
      user,
      ...(await this.sign(user.id, user.email, user.role, false))
    }
  }

  async login(dto: LoginDto) {
    const doc = await this.userModel
      .findOne({ email: dto.email })
      .select('+passwordHash')
      .exec()
    if (!doc) throw new UnauthorizedException('Credenciales inválidas')

    const ok = await bcrypt.compare(dto.password, doc.passwordHash)
    if (!ok) throw new UnauthorizedException('Credenciales inválidas')

    const user = doc.toObject<UserResponse>()
    return {
      user,
      ...(await this.sign(user.id, user.email, user.role, doc.superAdmin))
    }
  }

  private async sign(
    sub: string,
    email: string,
    role: string,
    superAdmin: boolean
  ) {
    const roles = [role]
    const payload = { sub, email, roles, superAdmin }
    const access_token = await this.jwt.signAsync(payload)
    return { access_token }
  }
}
