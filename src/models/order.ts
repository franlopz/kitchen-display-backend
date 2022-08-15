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
  categorie: string
  quantity: number
  name: string
  portion: string
  uid: string
  status: 'active' | 'prepared' | 'voided'
  isGift: boolean
  tags: TagInterface[]
}

export interface OrderInterface {
  account: Schema.Types.ObjectId
  area: string
  screen: string
  type: TypeOrderInterface
  isDone: Boolean
  isVoided: Boolean
  prepareAt: Date
  number: number
  tid: number
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
    isDone: { type: Boolean, required: false, default: false },
    isVoided: { type: Boolean, required: false, default: false },
    prepareAt: { type: Date, required: false },
    number: { type: Number, required: true },
    tid: { type: Number, required: true },
    table: { type: String, required: true },
    seller: { type: String, required: true },
    orders: [
      {
        quantity: { type: Number, required: true },
        name: { type: String, required: true },
        categorie: { type: String, required: true },
        portion: { type: String, required: true },
        uid: { type: String, required: true },
        status: {
          type: String,
          required: false,
          enum: ['active', 'prepared', 'voided'],
          default: 'active'
        },
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
