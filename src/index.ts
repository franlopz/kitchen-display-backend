import app from './app'
import './database'
import { Server as WebSocketServer } from 'socket.io'
import http from 'http'
import * as authJwtSocket from './middlewares/authJwtSocket'
import { getAccountId } from './libs/getAccountId'
import config from './config'

const server = http.createServer(app)
export const io = new WebSocketServer(server, { cors: { origin: true } })

io.use((socket, next) => {
  void authJwtSocket.verify(socket)
  next()
})

io.on('connection', (socket) => {
  socket.on('join', async (token) => {
    const accountId = await getAccountId(token)
    console.log(`Socket ${socket.id} joining ${accountId as string}`)
    await socket.join(accountId)
    socket.emit('joined', accountId)
  })

  socket.on('private', (data) => {
    const { msg, group } = data
    console.log(data)
    io.to(group).emit('private', msg)
    io.to('xx').emit('private', 'xx')
  })

  console.log(socket.rooms)
})

server.listen(config.PORT)
