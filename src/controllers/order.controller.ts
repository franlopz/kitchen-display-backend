import { Response } from 'express'
import { io } from '..'
import { accountIdAuthRequest } from '../middlewares/authJwt'
import Account from '../models/account'
import Order, { OrderInterface } from '../models/order'

export const submit = async (
  request: accountIdAuthRequest,
  response: Response
): Promise<void> => {
  try {
    const { accountId, body } = request
    if (accountId !== undefined) {
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
      io.to(accountId).emit(`${order.area}:${order.screen}/new`, {
        screenIdentifier: `${order.area}: ${order.screen}`,
        savedOrder
      })
      response.status(200).json(savedOrder)
    }
  } catch (error) {
    response.status(400).json(error)
  }
}

export const getAll = async (
  request: accountIdAuthRequest,
  response: Response
): Promise<void> => {
  try {
    const { accountId } = request
    const data = request.query
    const orders = await Order.find({
      ...data,
      account: accountId
    })
    response.status(200).json(orders)
  } catch (error) {
    response.status(400).json('Error fetching orders')
  }
}

export const getById = async (
  request: accountIdAuthRequest,
  response: Response
): Promise<void> => {
  try {
    const { accountId } = request
    const { _id } = request.query
    const order = await Order.find({ _id, account: accountId })
    response.status(200).json(order)
  } catch (error) {
    response.status(400).json('Error fetching order by id')
  }
}

export const updateOrderStatus = async (
  request: accountIdAuthRequest,
  response: Response
): Promise<void> => {
  try {
    const { accountId } = request
    const { account, _id, ...update } = request.query
    if (accountId !== undefined) {
      const order = await Order.findOneAndUpdate(
        { _id, account: accountId },
        update,
        { new: true, runValidators: true }
      )
      if (order !== null) {
        io.to(accountId).emit(`${order.area}:${order.screen}/updateStatus`, {
          ...update,
          id: _id,
          screenIdentifier: `${order.area}: ${order.screen}`,
          order
        })
      }
      response.status(200).json(order)
    }
  } catch (error) {
    response.status(400).json('Error updating order')
  }
}
