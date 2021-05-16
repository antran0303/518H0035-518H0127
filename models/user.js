const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  authId: {type: String},
  name: {type: String},
  email: {type: String},
  role: {type: String},
  image:{type: String}
  // created: Date,
})
const User = mongoose.model('User', userSchema)
module.exports = User






