var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var keys = require("../../key");
var User = require("../../models/user");



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    // (accessToken) => {
    //   console.log(accessToken);
    // }
    function (accessToken, refreshToken, profile, done) {
      // console.log(profile)
      // console.log("-------");

      picture = profile._json['picture'];

      const subemail = "@student.tdtu.edu.vn";
      // console.log(profile.emails[0].value)
      
      if (!profile.emails[0].value.includes(subemail)) {
        flagLogin = false;
        // const err = new Error('Not Found');
        // err.status = 404;
        console.log("Bạn không phải sinh viên TDTU");
        // return done(null, "Bạn Không phải sinh viên TDT");
        return done(null, false)
      } else {
        //console.log(profile);
        User.findOne({ authId: profile.id })
        .then((user) => {
          if (user) {
           
            return done(null, user);
          }

          //console.log(profile,"121");
          new User({
            
            authId: profile.id,
            name: profile.displayName,
            image:profile._json.picture,
            // created: new Date(),
            role: "student",
          })
            .save()
            .then((user) =>{
            done(null, user)})
            // .catch((err) => done(err, null));
        })
        // .catch((err) => {
        //   if (err) return done(err, null);
        // });
      }
    }
  )
);

module.exports= passport