import {NextFunction, Request, Response} from "express";

export const isLoggedIn = (req: Request, res: Response, next:NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('You must be logged in!');
  }
};

export const isNotLoggedIn = (req: Request, res: Response, next:NextFunction) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인이 되어 있습니다.');
    res.redirect(`/?error=${message}`);
  }
};
