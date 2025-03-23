import { auth } from '@clerk/nextjs/server'

export type Roles = 'admin' | 'moderator'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}


export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();

  return sessionClaims?.metadata.role === role
}
