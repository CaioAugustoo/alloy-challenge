import { NextFunction, Request, Response } from "express";
import { TokenProvider } from "../../shared/auth/token-provider";

type TokenContent = {
  sub: string;
};

export const auth = (tokenProvider: TokenProvider) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const request = {
      accessToken: req.headers?.["access-token"] as string,
      ...(req.headers || {}),
    };

    if (!request.accessToken) {
      res.status(401).json({ error: "Missing access token" });
    } else {
      const user = tokenProvider.verify(request.accessToken) as TokenContent;
      if (!user) {
        res.status(401).json({ error: "Invalid access token" });
      }

      req.accountId = user.sub;

      next();
    }
  };
};
