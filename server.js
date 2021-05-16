const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', true)


const db = mongoose.connect('mongodb+srv://User:1@socialnework1.t3zyv.mongodb.net/SocialNetwork?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
.then(()=> console.log("Success"))
.catch(err => console.log(err.reason));

// giờ kết nối vs mongo thành công r
// nhưng cái auth nó đang bị lỗi gì á

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://User:<1>@socialnework1.t3zyv.mongodb.net/SocialNetwork?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

module.exports = db