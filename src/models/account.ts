import mongoose, { Schema, model } from 'mongoose'

export interface AreaInterface {
  area: string
  screens: string[]
}

export interface UserInterface {
  name: string
  pin: string
  role: mongoose.Types.ObjectId
  areas: AreaInterface[]
  _id?: mongoose.Types.ObjectId
}

interface AccountInterface {
  business: string
  email: string
  password: string
  users: UserInterface[]
  areas: AreaInterface[]
}
const accountSchema = new Schema<AccountInterface>(
  {
    business: {
      type: String,
      unique: false
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    users: [
      {
        role: {
          type: Schema.Types.ObjectId,
          ref: 'Role',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        pin: {
          type: String,
          required: true
        },
        areas: [{ area: String, screens: [String] }]
      }
    ],
    areas: [{ area: String, screens: [String] }]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<AccountInterface>('Account', accountSchema)
