var express = require("express");
const { check, validationResult } = require("express-validator");
const facutyRouter = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("../middleware/passport/config");
const mySocket = require("../socket-config");
const News = require("../models/news");
const register = require("../models/register");



facutyRouter.get("/dashboardFacuty",function (req, res) {


  const name = req.flash("nameFacuty") || "";
  return res.render("dashboardFacuty", { name });
});



facutyRouter.get("/informFacuty", async (req, res) => {

  const listNews = await News.find().limit(5).sort({ time: -1 });

  console.log(listNews.content + '1234!')




    return res.render("informFacuty", { name: req.query.name });
});



const registerValidator = [
  check("name")
    .exists()
    .withMessage("vui lòng nhập tên khoa")
    .notEmpty()
    .withMessage("không để trống tên khoa"),

  check("email")
    .exists()
    .withMessage("Vui lòng nhập email")
    .notEmpty()
    .withMessage("Không để trống email"),
];




// Register Facuty
facutyRouter.post("/Register", registerValidator, (req, res) => {
  let result = validationResult(req);

  const { name, email } = req.body;

  let message = "";

  if (result.errors.length === 0) {
    console.log("hello");
    register.findOne({ email: email }).then((user) => {
      if (user) {
        message = "username này đã được đăng ký";

        req.flash("inform", message);
        res.render("Register");
      } else {
        const newFacuty = new register({
          name,
          email,
          password: "123456",
          role: "facuty",
        });

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newFacuty.password, salt, (err, hash) => {
            if (err) throw err;

            //Set password to hashed
            newFacuty.password = hash;
            newFacuty
              .save()
              .then((user) => {
                message = "You are now registered and can login now";
                req.flash("success", message);
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  } else {
    result = result.mapped();

    for (fields in result) {
      message = result[fields].msg;
      break;
    }

    req.flash("error", message);

    req.flash("name", name);

    res.redirect("/register");
  }
});









facutyRouter.post("/addNews", async function (req, res) {
  const { title, content } = req.body;

  var NewsPost = new News({
    title,
    content,
    time: new Date(),
  });

  try {
    NewsPost.save(function (err) {
      if (err) {
        res.json({ result: 0, errorMessage: "Fail" });
      } else {
        console.log(NewsPost, "!23");
        mySocket.getIO().local.emit("haveNewInform", "ok");
        res.json({ result: 1, title, content });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

facutyRouter.get("/getNews", async (req, res) => {
  
  const listNews = await News.find().limit(5).sort({ time: -1 });
  res.json(listNews);
});




facutyRouter.get("deleteInform/:id",async  (req, res) => {

  const {id} = req.params

  console.log(id + "1111")

  const inform = await news.findByIdAndDelete(id);
  if (!comment) return res.status(404).send("The news not found");
  
  await inform.delete;

  return res.redirect("/informFacuty");

})




module.exports = facutyRouter;
