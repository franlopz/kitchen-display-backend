import Role from '../models/role'

export const createRoles = async (): Promise<void> => {
  try {
    const count = await Role.estimatedDocumentCount()

    if (count > 0) return

    await Promise.all([
      Role.create({ name: 'admin' }),
      Role.create({ name: 'user' }),
      Role.create({ name: 'guest' })
    ])
  } catch (err) {
    console.log(err)
  }
}
