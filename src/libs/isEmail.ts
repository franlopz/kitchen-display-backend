const isEmail = (email: string): Boolean => {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

  if (email !== '' && email.match(emailFormat) != null) {
    return true
  }

  return false
}

export default isEmail
