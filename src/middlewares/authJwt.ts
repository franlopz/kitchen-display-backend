import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import Account from '../models/account'

export interface JwtPayload {
  id: string
  iat: number
  exp: number
}

export interface accountIdAuthRequest extends Request {
  accountId?: string
}

export const verifyToken = async (
  req: accountIdAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.token as string
  const today = Date.now()

  if (token === undefined) {
    res.status(401).json('No token provided')
    return
  }

  try {
    const decodedToken = jwt.verify(token, config.SECRET as string, {
      ignoreExpiration: true
    }) as JwtPayload

    const { id: accountId, exp } = decodedToken
    req.accountId = accountId
    const expirationMs = exp * 1000
    if (today > expirationMs) {
      res.status(401).json('Token expired')
      return
    }

    const account = Account.findOne({ _id: accountId })
    if (account === null) {
      res.status(401).json('Account not found')
      return
    }
    next()
  } catch (e) {
    res.status(401).json('Unauthorized')
  }
}

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.headers['refresh-token'] as string
  const today = Date.now()

  if (refreshToken === undefined) {
    res.status(401).json('No refresh token provided')
    return
  }
  try {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      config.SECRETREFRESHTOKEN as string,
      { ignoreExpiration: true }
    ) as JwtPayload
    const { id: accountId, exp } = decodedRefreshToken
    const expirationMs = exp * 1000
    if (today > expirationMs) {
      res.status(401).json('Refresh token expired')
      return
    }

    const account = Account.findOne({ _id: accountId })
    if (account === null) {
      res.status(401).json('Account not found')
      return
    }
    next()
  } catch (e) {
    res.status(401).json('Unauthorized')
  }
}
