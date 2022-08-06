import { RequestHandler, Request, Response, Router } from 'express'
import * as setupController from '../controllers/setup.controller'
import * as authJwt from '../middlewares/authJwt'

const router = Router()

router.post(
  '/initialize/',
  [authJwt.verifyRefreshToken, authJwt.verifyToken],
  (async (request: Request, response: Response) => {
    await setupController.initialize(request, response)
  }) as RequestHandler
)

export default router
