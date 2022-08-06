import jwt from 'jsonwebtoken'
import config from '../config'

interface Props {
  accountId: string
}
export const generateToken = ({ accountId }: Props): string => {
  let token = ''
  if (config.SECRET !== undefined) {
    token = jwt.sign({ id: accountId }, config.SECRET, {
      expiresIn: config.TOKEN_EXPIRATION
    })
  }
  return token
}

export const generateRefreshToken = ({ accountId }: Props): string => {
  let refreshToken = ''
  if (config.SECRETREFRESHTOKEN !== undefined) {
    refreshToken = jwt.sign({ id: accountId }, config.SECRETREFRESHTOKEN, {
      expiresIn: config.REFRESH_TOKEN_EXPIRATION
    })
  }
  return refreshToken
}
