import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import sendResponse from "../utils/sendResponse";
import jwt, { decode, type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access",
        });
        return;
      }
      const decoded = jwt.verify(
        token as string,
        config.access_secret as string,
      ) as JwtPayload;

      const userData = await pool.query(
        `
            SELECT * from users WHERE email=$1
            `,
        [decoded.email],
      );

      //   console.log(userData);
      if (userData.rows.length === 0) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "User not found",
        });
        return;
      }
      const user = userData.rows[0];
      // console.log(user);
      req.user = decoded;
      if (roles.length && !roles.includes(user.role)) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden,The user has no access",
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
