import { Role } from '@prisma/client'
import { Title } from './game'

export interface DecodedUser {
  username: string
  roles: Role[]
  rating: number
  title?: Title
}
