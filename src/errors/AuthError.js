// This module defines the `AuthError` class, which extends the built-in `Error` class to provide a standardized way to represent authentication-related errors in an Express.js application. The `AuthError` class includes additional properties such as `statusCode`, `code`, and `details` to provide more context about the error.

// Custom error class for authentication-related errors in Express.js applications
class AuthError extends Error {
  constructor(statusCode, message, code = "AUTH_ERROR", details = null) {
    super(message);

    this.name = "AuthError";
    this.statusCode = statusCode || 500;
    this.success = false;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AuthError;
