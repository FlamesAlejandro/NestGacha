export const ACTIONS = ['create', 'read', 'update', 'delete', 'manage'] as const
export type Action = (typeof ACTIONS)[number]
