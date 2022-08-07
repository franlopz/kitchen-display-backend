import { Response } from 'express'
import { accountIdAuthRequest } from '../middlewares/authJwt'
import Account from '../models/account'
import Order, { OrderInterface } from '../models/order'

export const submit = async (
  request: accountIdAuthRequest,
  response: Response
): Promise<void> => {
  try {
    const { accountId, body } = request
    console.log(body)
    const account = await Account.findOne({ _id: accountId })
    if (account === null) {
      response.status(401).json('Account not found')
      return
    }

    const orderToSave: OrderInterface = {
      ...body,
      account: accountId
    }

    const order = new Order(orderToSave)
    const savedOrder = await order.save()
    response.status(200).json(savedOrder._id)
  } catch (err) {
    response.json(err)
  }
}
