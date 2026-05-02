// This module defines the `authorize` function, which creates an authorization middleware for Express.js applications. The middleware checks if the authenticated user has the required role(s) to access a specific route. It supports both direct role matching and hierarchical role checking based on a defined role priority. The middleware also handles various error scenarios, such as missing authentication or insufficient permissions, by throwing appropriate errors.
import AuthError from "../errors/AuthError.js";

const DEFAULT_ROLE_PRIORITY = {
  user: 1,
  moderator: 2,
  admin: 3,
  superadmin: 4,
};

// This function creates an authorization middleware for Express.js applications. The middleware checks if the authenticated user has the required role(s) to access a specific route. It supports both direct role matching and hierarchical role checking based on a defined role priority. The middleware also handles various error scenarios, such as missing authentication or insufficient permissions, by throwing appropriate errors.
export function authorize(options = {}) {
  if (typeof options === "string") {
    options = { allow: [options] };
  }

  const {
    allow = [],
    allowHierarchy = false,
    roleKey = "role",
    rolePriority = DEFAULT_ROLE_PRIORITY,
  } = options;

  const allowedRoles = allow.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthError(401, "Authentication required");
      }

      const userRole = String(req.user[roleKey] || "").toLowerCase();

      if (!userRole) {
        throw new AuthError(403, "User role not found");
      }

      if (allowHierarchy) {
        const userPriority = rolePriority[userRole] || 0;

        const isAllowed = allowedRoles.some((role) => {
          const requiredPriority = rolePriority[role] || 0;
          return userPriority >= requiredPriority;
        });

        if (!isAllowed) {
          throw new AuthError(403, "Insufficient permissions");
        }
      } else {
        if (!allowedRoles.includes(userRole)) {
          throw new AuthError(
            403,
            "You do not have permission to access this resource",
          );
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
