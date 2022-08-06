import { model, Schema } from 'mongoose'

interface Role {
  name: string
}

const roleSchema = new Schema<Role>(
  {
    name: {
      type: String,
      unique: true
    }
  },
  { versionKey: false }
)

export default model<Role>('Role', roleSchema)
