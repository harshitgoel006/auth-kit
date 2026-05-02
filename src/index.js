// This module serves as the main entry point for the `express-auth-kit` package. It exports the core authentication middleware creation function, an authorization middleware, a default error handler, and a custom authentication error class. These exports allow users to easily integrate authentication and authorization functionality into their Express.js applications using the provided tools and configurations.

export { createAuth } from "./core/createAuth.js";
export { authorize } from "./middleware/authorize.js";
export { defaultErrorHandler } from "./middleware/errorHandler.js";
export { default as AuthError } from "./errors/AuthError.js";
