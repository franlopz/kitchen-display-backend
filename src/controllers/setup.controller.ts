import { Response } from 'express'
import { accountIdAuthRequest } from '../middlewares/authJwt'
import Account, { AreaInterface } from '../models/account'
import Role from '../models/role'

interface Screen {
  [key: string]: string[]
}

interface UserInterface {
  name: string
  pin: string
  role: string
  screens: Screen
}

export const initialize = async (
  request: accountIdAuthRequest,
  response: Response
): Promise<void> => {
  try {
    const accountId = request.accountId
    const { users, screens } = request.body
    const account = await Account.findOne({ _id: accountId })
    const pinArray: string[] = []
    const userNameArray: string[] = []

    if (users.length < 1) {
      response.status(400).json({
        error: 'No users to initialize'
      })
      return
    }

    if (screens.length < 1) {
      response.status(400).json({
        error: 'No screens to initialize'
      })
      return
    }

    if (account === null) {
      response.status(404).json({
        error: 'Account not found'
      })
      return
    }

    if (account.users.length > 0 && account.areas.length > 0) {
      response.status(400).json({
        error: 'Account already initialized'
      })
      return
    }

    for (const user of users) {
      const { name, pin, role: userRole, screens } = user as UserInterface
      const role = await Role.findOne({ name: userRole.toLowerCase() })

      if (userNameArray.includes(name)) {
        response.status(400).json({
          error: 'Duplicated user name in the request'
        })
        return
      }
      if (pinArray.includes(pin)) {
        response.status(400).json({
          error: 'Duplicated pin in the request'
        })
        return
      }

      userNameArray.push(name)
      pinArray.push(pin)

      const areas: AreaInterface[] = []

      if (role === null) {
        response.status(404).json({
          error: 'Role not found'
        })
        return
      }

      const userNameExists = await Account.findOne(
        { _id: accountId, 'users.name': name },
        { 'users.$': 1 }
      )

      const pinExists = await Account.findOne(
        { 'users.pin': pin, _id: accountId },
        { 'users.$': 1 }
      )

      if (userNameExists !== null) {
        response.status(404).json({ error: 'Username exists' })
        return
      }

      if (pinExists !== null) {
        response.status(404).json({ error: 'Pin exists' })
        return
      }

      Object.keys(screens).forEach((area) => {
        areas.push({ area: area, screens: screens[area] })
      })

      account.users.push({
        name,
        pin: pin,
        role: role._id,
        areas: areas
      })
    }

    Object.keys(screens).forEach((area) => {
      account.areas.push({ area: area, screens: screens[area] })
    })

    await account.save()

    response.status(200).json('Setup complete')
  } catch (err) {
    response.status(400).json('An error occurred ' + err)
  }
}
