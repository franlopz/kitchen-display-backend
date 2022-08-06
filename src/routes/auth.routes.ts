import { RequestHandler, Response, Router } from 'express'
import * as authController from '../controllers/auth.controller'
import * as authJwt from '../middlewares/authJwt'

const router = Router()

router.get(
  '/',
  [authJwt.verifyRefreshToken, authJwt.verifyToken],
  (_request: authJwt.accountIdAuthRequest, _response: Response) => {
    console.log(_request.accountId)
    return _response.json('xs')
  }
)

router.post('/signup/', (async (request, response) => {
  await authController.signUp(request, response)
}) as RequestHandler)

router.post('/login/', (async (request, response) => {
  await authController.login(request, response)
}) as RequestHandler)

router.post(
  '/user/',
  [authJwt.verifyRefreshToken, authJwt.verifyToken],
  (async (request, response) => {
    await authController.userLogin(request, response)
  }) as RequestHandler
)

router.post('/refresh/token/', [authJwt.verifyRefreshToken], (async (
  request,
  response
) => {
  await authController.refreshToken(request, response)
}) as RequestHandler)

export default router
