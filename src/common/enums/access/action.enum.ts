export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export const ALL_ACTIONS = [
  Action.Create,
  Action.Read,
  Action.Update,
  Action.Delete
] as const

export function expandActions(actions: Action[]) {
  const set = new Set(actions)
  if (set.has(Action.Manage)) ALL_ACTIONS.forEach((a) => set.add(a))
  return set
}
