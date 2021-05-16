const mongoose = require('mongoose')
const feedSchema = mongoose.Schema({
  content: {type: String},
  ownerID: {type: String},
  time: {type: Date},
})
const Feed = mongoose.model('Feed', feedSchema)
module.exports = Feed