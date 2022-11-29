import passport from "passport";
import { Strategy as googleStrategy } from "passport-google-oauth2";
import User from "../models/user";

export default () => {
  passport.use(
    "google",
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("google profile", profile);
        try {
          const exUser = await User.findOne({
            where: { userId: profile.email },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              userId: profile._json && profile.email,
              nickname: profile.displayName,
              provider: "google",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
