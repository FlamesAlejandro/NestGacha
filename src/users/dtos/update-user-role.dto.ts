import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateUserRoleDto {
  @IsOptional()
  @IsString()
  role?: string

  @IsOptional()
  @IsBoolean()
  superAdmin?: boolean
}
