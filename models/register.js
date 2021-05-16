const mongoose = require('mongoose')
const registerSchema = mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    role: {type: String}
    
  })
  const Accounts = mongoose.model('Accounts', registerSchema)
  module.exports = Accounts