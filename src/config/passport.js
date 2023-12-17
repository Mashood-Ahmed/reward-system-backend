import passport from "passport";
import { User } from "../api/v1/User/User.js";

const passportConfig = () => {
  try {
    passport.use(async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);

      function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      }

      console.log(uuid(), "UUID");

      // var userID = uuid() //something like: "ec0c22fa-f909-48da-92cb-db17ecdb91c5"
      try {
        const user = await User.findOrCreate({
          where: { id: uuid() },
        });
        console.log(user);
      } catch (e) {
        console.log(e.message);
      }
    });

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      await User.findByPk(id, (err, user) => done(err, user));
    });
  } catch (e) {
    console.log(e.message);
  }
};

export default passportConfig;
