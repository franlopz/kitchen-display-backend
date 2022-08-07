import { model, Schema } from 'mongoose'

interface TypeOrderInterface {
  name: string
  color: string
}

interface TagInterface {
  quantity: number
  name: string
}
interface ItemInterface {
  quantity: number
  name: string
  portion: string
  status: 'active' | 'prepared' | 'voided'
  isGift: boolean
  tags: TagInterface[]
}

export interface OrderInterface {
  account: Schema.Types.ObjectId
  area: string
  screen: string
  type: TypeOrderInterface
  status: 'active' | 'prepared' | 'voided'
  prepareAt: Date
  number: number
  table: string
  seller: string
  orders: ItemInterface[]
}

const orderSchema = new Schema<OrderInterface>(
  {
    account: { type: Schema.Types.ObjectId, required: true },
    area: { type: String, required: true },
    screen: { type: String, required: true },
    type: {
      name: { type: String, required: true },
      color: { type: String, required: false }
    },
    status: { type: String, required: false, default: 'active' },
    prepareAt: { type: Date, required: false },
    number: { type: Number, required: true },
    table: { type: String, required: true },
    seller: { type: String, required: true },
    orders: [
      {
        quantity: { type: Number, required: true },
        name: { type: String, required: true },
        portion: { type: String, required: true },
        status: { type: String, required: false, default: 'active' },
        isGift: { type: Boolean, required: true },
        tags: [
          {
            quantity: { type: Number, required: true },
            name: { type: String, required: true }
          }
        ]
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<OrderInterface>('Order', orderSchema)
