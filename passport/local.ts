import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import User from '../models/user';

export default () => {
  passport.use('local', new Strategy({
    usernameField: 'userId',
    passwordField: 'password',
  }, async (userId, password, done) => {
    try {
      const user = await User.findOne({ where: { userId } });
      if (!user) {
        return done(null, false, { message: "This user doesn't exist." });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }
      return done(null, false, { message: "Wrong password." });
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }))
};