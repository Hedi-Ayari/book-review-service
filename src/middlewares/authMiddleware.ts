import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || ("your_jwt_secret" as string);

// Middleware to verify the token and check user role
export const verifyAndCheckRole = (allowedRoles: string[]) => {
  return async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Access denied, no token provided" });
      return;
    }

    try {
      console.log(JWT_SECRET);

      const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
      req.user = decoded;
      console.log(allowedRoles);

      if (allowedRoles.includes(req.user.role)) {
        return next();
      }

      res
        .status(403)
        .json({ error: "You do not have permission to access this resource" });
      return;
    } catch (err) {
      console.log(err);

      res.status(401).json({ error: "Invalid token" });
    }
  };
};
