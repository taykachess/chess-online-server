import { Role } from '@prisma/client'
import { Title } from './game'

export interface DecodedUser {
  username: string
  roles?: Role[]
  rating?: number
  title?: Title | null
}

export interface createUserEmailPassDto {
  username: string
  email: string
  password: string
}
