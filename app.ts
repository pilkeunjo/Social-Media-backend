import express from "express";
import {
  RequestHandler,
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import hpp from "hpp";
import Helmet from "helmet";

import passportConfig from "./passport";
import { sequelize } from "./models";
import userRouter from "./router/user";
import postRouter from "./router/post";
import postsRouter from "./router/posts";
import hashtagRouter from "./router/hashtag";
import authRouter from "./router/auth";

// Initial configuration
dotenv.config();
const app = express();
const production: boolean = process.env.NODE_ENV === "production";

app.set("port", process.env.PORT);
passportConfig();
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err: Error) => {
    console.error(err);
  });

// Security Configuration
if (production) {
  app.use(hpp());
  app.use(Helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

// Cookie, Session, and Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET as string,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain: production ? "joelpersonal.com" : undefined,
    },
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);
app.use("/auth", authRouter);

// Default Router
const defaultRouter: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("This app is online.");
};
app.get("/", defaultRouter);

// Error Handler Router
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong.");
};
app.use(errorHandler);

app.listen(app.get("port"), () => {
  console.log(`Server is on and listening on port - ${app.get("port")}`);
});
