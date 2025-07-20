export const UserRole = {
  ADMIN: 'Admin',
  AREAS_STAFF: 'Areas_STAFF'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const hasAnyRole = (userRole: string | null, allowedRoles: UserRoleType[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.some(role => role === userRole);
};
