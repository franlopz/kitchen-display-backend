import { Socket } from 'socket.io'
import { getAccountId } from '../libs/getAccountId'

export const verify = async (socket: Socket): Promise<any> => {
  const token = socket.handshake.query.token as string

  if (token === undefined) {
    return new Error('Token not found')
  }
  const result = await getAccountId(token)
  return result
}
