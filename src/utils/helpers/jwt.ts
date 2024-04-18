import jwt from 'jsonwebtoken'

import { IUser } from '@resources/user/user.interface'

export const signJwt = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string)
}

export const verifyJwt = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string)
}

export const generateTokenPayload = (user: IUser) => {
  return {
    id: user._id,
    name: user.firstname + ' ' + user.lastname,
    firstname: user.firstname,
    permission: user.permission,
    email: user.email,
    image: user.image,
    isOnboarded: user.isOnboarded,
    onboardingStatus: user.onboardingStatus
  }
}
