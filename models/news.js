const mongoose = require('mongoose')
const newsSchema = mongoose.Schema({
  facutyID: {type: String},
  title: {type: String},
  content: {type: String},
  time: {type: Date},
})
const News = mongoose.model('News', newsSchema)
module.exports = News