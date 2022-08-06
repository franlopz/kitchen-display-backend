import { config } from 'dotenv'

config()

export default {
  SECRET: process.env.SECRET,
  SECRETREFRESHTOKEN: process.env.SECRETREFRESHTOKEN,
  TOKEN_EXPIRATION: 3600,
  REFRESH_TOKEN_EXPIRATION: 432000
}
