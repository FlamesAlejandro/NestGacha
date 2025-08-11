import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  Action,
  ALL_ACTIONS,
  expandActions,
  Role,
  RoleDocument,
  RolesEfficiency,
  User,
  UserDocument
} from 'src/common'

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(Role.name) private readonly _roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>
  ) {}

  async effectiveActionsForUser(
    userId: string,
    moduleKey: string
  ): Promise<Set<Action>> {
    const user = await this._userModel
      .findById(userId, { role: 1, moduleGrants: 1 })
      .lean()
      .exec()
    if (!user) return new Set()

    if (user.role === RolesEfficiency.superAdmin) {
      return new Set([Action.Manage, ...ALL_ACTIONS])
    }

    const merged = new Set<Action>()

    if (user.role) {
      const r = await this._roleModel
        .findOne({ key: user.role }, { moduleGrants: 1 })
        .lean()
        .exec()
      const g = r?.moduleGrants.find((m) => m.module === moduleKey)
      if (g) expandActions(g.actions).forEach((a) => merged.add(a))
    }

    const u = user.moduleGrants?.find((m) => m.module === moduleKey)
    if (u) expandActions(u.actions).forEach((a) => merged.add(a))

    return merged
  }

  async has(userId: string, moduleKey: string, needed: Action | Action[]) {
    const req = Array.isArray(needed) ? needed : [needed]
    const eff = await this.effectiveActionsForUser(userId, moduleKey)
    return req.every((a) => eff.has(a))
  }
}
