var express = require("express");
const { check, validationResult } = require("express-validator");
const register = require("../models/register");
const Router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const passport = require("passport");
const Facuty = require("../models/register");
const config = require("../middleware/passport/config");
const Feed = require("../models/feed")
const User = require("../models/user")
const Cmt = require("../models/cmt")

Router.use(config.initialize());
Router.use(config.session());

Router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

Router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    return res.redirect("/dashboardStudent");
  }
);


Router.get("/dashboardStudent", async function (req, res) {

  var feeds = await Feed.find().sort({_id : -1})
  var users = await User.find().sort({_id : -1})
  var cmts = await Cmt.find().sort({_id : -1})
  let feed = []
  feeds.forEach((f , index) => {
    let tmp
    users.forEach(u => {
      if(f.ownerID === u.authId) {
        tmp = {
          id: f.id,
          content: f.content,
          ownerInfo: u
        }
        return;
      }
    
    })
    let comment = []
    cmts.forEach(c => {
      if((String(f._id)) === String(c.feedID)){
        let usertmp
        users.forEach(u => {
          if(c.ownerID === u.authId) {
            usertmp = u
          }
        })
        comment.push({
          id: c._id,
          content: c.content,
          cmtOwner: usertmp
        })
      }
    })
    feed.push({
      id: tmp.id,
      content: tmp.content,
      ownerInfo: tmp.ownerInfo,
      comment: comment
    })
    
  })
  console.log(feed,"!!!!");
  console.log("---------");
  return res.render("dashboardStudent", { feeds: feed , user: req.session.user});

});

Router.get("/login", (req, res) => {
  const error = req.flash("error") || "";
  res.render("login", { error });
});



Router.get("/dashboardAdmin", function (req, res) {
  const name = req.flash("name") || "";
  return res.render("dashboardAdmin", { name });
});



Router.get("/Register", (req, res) => {
  const error = req.flash("error") || "";
  const name = req.flash("name") || "";
  const email = req.flash("email") || "";

  res.render("Register", { error, name, email });
});



const LoginValidator = [
  check("email")
    .exists()
    .withMessage("Vui lòng nhập username")
    .notEmpty()
    .withMessage("không để trống username"),

  check("password")
    .exists()
    .withMessage("Vui lòng nhập password")
    .notEmpty()
    .withMessage("Không để trống password"),
];


//login with username and password
Router.post("/login", LoginValidator, (req, res) => {
  let result = validationResult(req);

  const { email, password } = req.body;
  let message = "";

  if (result.errors.length === 0) {
    Facuty.findOne({ email: email })
      .then((user) => {
        if (user) {
          if (user.role == "admin") {
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) {
                throw err;
              }
              if (result) {
                req.flash("name", user.name);
                res.redirect("dashboardAdmin");
              } else {
                message = "Password does not match";

                req.flash("inform", message);
                res.render("login");
              }
            });
          } else if (user.role == "facuty") {
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) {
                throw err;
              }
              if (result) {
                req.flash("nameFacuty", user.name);
                res.redirect("dashboardFacuty");
              } else {
                message = "Password does not match";

                req.flash("inform", message);
                res.render("login");
              }
            });
          }
        } else {
          message = "That email is not register";
          req.flash("inform", message);
          res.render("login");
        }
      })
      .catch((err) => console.log(err));
  } else {
    result = result.mapped();

    for (fields in result) {
      message = result[fields].msg;
      break;
    }

    req.flash("error", message);

    res.redirect("/login");
  }
});


Router.post('/postfeed', async function(req, res) {
    var content = req.body.content;
    var user = req.user;
    var time = new Date(). getTime();

    // console.log(user.authId);
  
    var newFeed = await  new Feed({
        'content': content,
        'ownerID': user.authId,
    });
    // console.log(newFeed);
  try {
     newFeed.save(function(err){
        if (err){
            res.json({result: 0, errorMessage: 'Fail'})
        }
        else {
            res.json({result: 1, newFeed:newFeed, user: req.user})
        }
    });  
  } catch (error) {
    console.log(error);
  }
   
  })

  Router.get('/delete/:id', async(req, res) => {

    try {
      const {id} = req.params;

    const post = await Feed.findByIdAndDelete(id);

    if (!post) return res.status(404).send('The feed not found')

    await post.delete

    return res.redirect('/dashboardStudent')
    } catch (error) {
      console.log(error);
    }

  })







  Router.post('/edit/:id', async(req, res) => {
    try {
      const {id} = req.params;

    var content = req.body.content;
    
    const post = await Feed.findByIdAndUpdate(id, {content: content});
    console.log(post);

    res.redirect('/dashboardStudent')
    } catch (error) {
      console.log(error);
    }
  })


  
  Router.post("/cmt", async function (req, res) {
    var content = req.body.content;
    var userID = req.user.authId;
    var feedID = req.body.postID
  
    // console.log(content);
    // console.log(userID);
    // console.log(feedID);
  
    var newCmt = await new Cmt({
      content: content,
      feedID: feedID,
      ownerID: userID,
    });
  
    try {
      newCmt.save(function (err) {
        if (err) {
          res.json({ result: 0, errorMessage: "Fail" });
        } else {
          res.json({ result: 1, newCmt: newCmt, user: req.user });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  Router.get("/deleteCmt/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const comment = await Cmt.findByIdAndDelete(id);
  
      if (!comment) return res.status(404).send("The cooment not found");
  
      await comment.delete;
  
      return res.redirect("/dashboardStudent");
    } catch (error) {
      console.log(error);
    }
  });

module.exports = Router;



