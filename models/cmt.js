const mongoose = require("mongoose");
const cmtSchema = mongoose.Schema({
  content: { type: String },
  feedID: { type: String },
  ownerID: { type: String },
});
const Cmt = mongoose.model("Cmt", cmtSchema);
module.exports = Cmt;