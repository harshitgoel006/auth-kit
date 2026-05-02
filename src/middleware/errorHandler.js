// This module defines the `defaultErrorHandler` function, which is an Express.js error-handling middleware. It formats and sends a JSON response containing error details when an error occurs during request processing. The response includes the success status, error message, error code, and any additional details provided in the error object.

export function defaultErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    code: err.code || "INTERNAL_ERROR",
    details: err.details || null,
  });
}
