import { SetMetadata } from '@nestjs/common'
import { Action } from 'src/common'

export const ROLES_KEY = 'required_roles'
export const RESOURCE_KEY = 'module_resource'
export const ACL_KEY = 'required_acl'

export const RolesRequired = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles)
export const ModuleResource = (moduleKey: string) =>
  SetMetadata(RESOURCE_KEY, moduleKey)
export const Actions = (...actions: Action[]) => SetMetadata(ACL_KEY, actions)
export const ActionsOn = (moduleKey: string, ...actions: Action[]) =>
  SetMetadata(ACL_KEY, { moduleKey, actions })
