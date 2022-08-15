import { Request, RequestHandler, Response, Router } from 'express'
import * as orderController from '../controllers/order.controller'
import * as authJwt from '../middlewares/authJwt'

const router = Router()

router.post(
  '/submit/',
  [authJwt.verifyRefreshToken, authJwt.verifyToken],
  (async (request: Request, response: Response) => {
    await orderController.submit(request, response)
  }) as RequestHandler
)

router.get(
  '/getAll/',
  [authJwt.verifyRefreshToken, authJwt.verifyToken],
  (async (request: Request, response: Response) => {
    await orderController.getAll(request, response)
  }) as RequestHandler
)

router.get(
  '/getById/',
  [authJwt.verifyRefreshToken, authJwt.verifyToken],
  (async (request: Request, response: Response) => {
    await orderController.getById(request, response)
  }) as RequestHandler
)

router.patch(
  '/updateOrderStatus/',
  [authJwt.verifyRefreshToken, authJwt.verifyToken],
  (async (request: Request, response: Response) => {
    await orderController.updateOrderStatus(request, response)
  }) as RequestHandler
)
export default router
