// This module defines the `createTokenExtractor` function, which generates a token extraction function for Express.js applications. The generated function can extract tokens from various sources (headers, cookies, query parameters) based on the provided configuration options.

// This function creates a token extractor function based on the specified options for token sources and their respective names.
export function createTokenExtractor(options = {}) {
  const {
    sources = ["header", "cookie"],
    headerName = "authorization",
    cookieName = "accessToken",
    queryName = "token",
  } = options;

  return function extractToken(req) {
    for (const source of sources) {
      if (source === "header") {
        const authHeader = req.headers?.[headerName];

        if (authHeader && authHeader.startsWith("Bearer ")) {
          return authHeader.replace("Bearer ", "").trim();
        }
      }
      if (source === "cookie") {
        if (req.cookies?.[cookieName]) {
          return req.cookies[cookieName];
        }
      }

      if (source === "query") {
        if (req.query?.[queryName]) {
          return req.query[queryName];
        }
      }
    }

    return null;
  };
}
