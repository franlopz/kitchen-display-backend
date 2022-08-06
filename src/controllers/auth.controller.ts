import { Request, Response } from 'express'
import Account from '../models/account'
import * as bcrypt from 'bcryptjs'
import config from '../config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateToken, generateRefreshToken } from '../libs/generateToken'
import * as authJwt from '../middlewares/authJwt'
import Role from '../models/role'

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, business, confirmPassword } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const accountExist = await Account.findOne({ email })

    if (accountExist !== null) {
      res.status(409).json('Account already exists')
      return
    }

    if (password !== confirmPassword) {
      res.status(409).json('Passwords do not match')
      return
    }

    const account = new Account({
      email,
      password: hash,
      business
    })
    await account.save()
    res.json('Account created')
  } catch (err) {
    res.status(400).json('Error creating account')
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const account = await Account.findOne({ email })

    if (account === null) {
      res.status(401).json('Account not found')
      return
    }

    const isValid = bcrypt.compareSync(password, account.password)
    if (!isValid) {
      res.status(401).json('Invalid password')
      return
    }

    const today = Date.now()
    const tokenExpiration = config.TOKEN_EXPIRATION * 1000
    const refreshTokenExpiration = config.REFRESH_TOKEN_EXPIRATION * 1000
    const tokenExpires = today + tokenExpiration
    const refreshTokenExpires = today + refreshTokenExpiration

    const token = generateToken({ accountId: account._id.toString() })
    const refreshToken = generateRefreshToken({
      accountId: account._id.toString()
    })

    const setupCompleted = account.users.length > 0

    res.json({
      setupCompleted,
      token,
      tokenExpiration: tokenExpires,
      refreshToken,
      refreshTokenExpiration: refreshTokenExpires
    })
  } catch (err) {
    res.json(err)
  }
}

export const userLogin = async (
  req: authJwt.accountIdAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const accountId = req.accountId
    const { pin } = req.body

    const user = await Account.findOne(
      { 'users.pin': pin, _id: accountId },
      { 'users.$': 1 }
    )

    if (user === null) {
      res.status(401).json('Incorrect pin')
      return
    }
    const { name: userName, role: roleId, _id: userId } = user?.users[0]
    const role = await Role.findById(roleId)

    if (role === null) {
      res.status(404).json('Role not found')
      return
    }
    const { name: roleName } = role

    res.json({ userId, roleName, userName })
  } catch (error) {
    res.json(error)
  }
}

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.headers['refresh-token'] as string
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      config.SECRETREFRESHTOKEN as string,
      { ignoreExpiration: true }
    ) as JwtPayload
    const { id: accountId } = decodedRefreshToken
    const account = await Account.findOne({ _id: accountId })
    if (account === null) {
      res.status(401).json('Account not found')
      return
    }
    const today = Date.now()
    const tokenExpiration = config.TOKEN_EXPIRATION * 1000
    const refreshTokenExpiration = config.REFRESH_TOKEN_EXPIRATION * 1000
    const tokenExpires = today + tokenExpiration
    const refreshTokenExpires = today + refreshTokenExpiration

    const newToken = generateToken({ accountId })
    const newRefreshToken = generateRefreshToken({ accountId })

    res.json({
      token: newToken,
      tokenExpiration: tokenExpires,
      refreshToken: newRefreshToken,
      refreshTokenExpiration: refreshTokenExpires
    })
  } catch (err) {
    res.json(err)
  }
}
