import mongoose from 'mongoose'

mongoose
  .connect('mongodb://localhost/displaydb')
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB: ', err.message)
  })
