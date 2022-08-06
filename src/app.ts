import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes'
import setupRoutes from './routes/setup.routes'
import orderRoutes from './routes/order.routes'
import { createRoles } from './libs/initialSetup'
import cors from 'cors'

const app = express()
void createRoles()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/setup', setupRoutes)
app.use('/order', orderRoutes)

export default app
