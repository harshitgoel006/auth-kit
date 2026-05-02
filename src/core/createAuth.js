// This module defines the `createAuth` function, which generates an authentication middleware for Express.js applications. The middleware verifies JWT tokens, retrieves user information, and performs various checks based on the provided configuration options. It also supports custom error handling and token extraction methods.

import jwt from "jsonwebtoken";
import AuthError from "../errors/AuthError.js";
import { createTokenExtractor } from "./tokenExtractor.js";

// This function creates an authentication middleware for Express.js applications. It verifies JWT tokens, fetches user information, and performs various checks based on the provided configuration options. The middleware can be customized with error handling, token extraction methods, and additional checks for user status.
export function createAuth(config = {}) {
  const {
    jwtSecret,
    getUser,
    tokenExtractor,
    tokenSources = ["header", "cookie"],
    checks = {},
    onError,
    debug = false,
    strict = false,
  } = config;

  if (!jwtSecret) {
    throw new Error("jwtSecret is required");
  }
  if (typeof getUser !== "function") {
    throw new Error("getUser function is required");
  }

  const log = (...args) => {
    if (debug) console.log("[AUTH]", ...args);
  };

  const extractToken =
    typeof tokenExtractor === "function"
      ? tokenExtractor
      : createTokenExtractor({ sources: tokenSources });

  const authenticate = async (req, res, next) => {
    try {
      log("Incoming request");

      const token = extractToken(req);
      log("Token extracted:", !!token);

      if (!token) {
        throw new AuthError(401, "Unauthorized: No token provided", "NO_TOKEN");
      }

      let decoded;
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw new AuthError(401, "Token expired", "TOKEN_EXPIRED");
        }
        if (err.name === "JsonWebTokenError") {
          throw new AuthError(401, "Invalid token", "INVALID_TOKEN");
        }
        throw err;
      }

      log("Token verified");

      const user = await getUser(decoded._id);
      log("User fetched:", !!user);

      if (!user) {
        throw new AuthError(401, "User not found");
      }

      if (strict && !user.role) {
        throw new AuthError(403, "User role missing");
      }

      if (checks.requireActive && user.isActive === false) {
        throw new AuthError(403, "User account inactive");
      }

      if (checks.requireNotDeleted && user.isDeleted === true) {
        throw new AuthError(403, "User account deleted");
      }

      if (typeof checks.custom === "function") {
        await checks.custom(user, req);
      }

      req.user = user;

      log("Auth success");

      next();
    } catch (err) {
      log("Auth error:", err.message);

      if (typeof onError === "function") {
        return onError(err, req, res, next);
      }

      next(err);
    }
  };

  return {
    authenticate,
  };
}
