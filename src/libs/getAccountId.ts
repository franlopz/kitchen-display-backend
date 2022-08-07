import config from '../config'
import { JwtPayload } from '../middlewares/authJwt'
import Account from '../models/account'
import jwt from 'jsonwebtoken'

export const getAccountId = async (token: string): Promise<any> => {
  const today = Date.now()
  try {
    const decodedToken = jwt.verify(token, config.SECRET as string, {
      ignoreExpiration: true
    }) as JwtPayload

    const { id: accountId, exp } = decodedToken
    const expirationMs = exp * 1000
    if (today > expirationMs) {
      return new Error('Token expired')
    }
    const account = await Account.findOne({ _id: accountId })
    if (account === null) {
      return new Error('Account not found')
    }
    return accountId
  } catch (error) {
    return new Error('Error while authorizing')
  }
}
