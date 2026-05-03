# Auth Kit

[![npm version](https://img.shields.io/npm/v/@goelharshit006/auth-kit)](https://www.npmjs.com/package/@goelharshit006/auth-kit)
[![npm downloads](https://img.shields.io/npm/dm/@goelharshit006/auth-kit)](https://www.npmjs.com/package/@goelharshit006/auth-kit)
[![license](https://img.shields.io/npm/l/@goelharshit006/auth-kit)](LICENSE)

> Production-ready authentication and authorization middleware for Express.js

---

## Features

- JWT-based authentication  
- Plug-and-play middleware (`authenticate`)  
- Role-based access control (`authorize`)  
- Fully configurable (no DB coupling)  
- Flexible token sources (header, cookie, query)  
- Custom validation hooks  
- Debug mode support  
- Custom error handling support  
- Lightweight & reusable  

---

## Installation

```bash
npm install @goelharshit006/auth-kit
````

---

## Quick Start

```js
import express from "express";
import { createAuth, authorize } from "@goelharshit006/auth-kit";

const app = express();

// Example user fetch function (replace with DB call)
const getUser = async (id) => {
  return {
    _id: id,
    role: "admin",
    isActive: true,
  };
};

// Initialize auth system
const { authenticate } = createAuth({
  jwtSecret: "your_secret_key",
  getUser,
});

// Public route
app.get("/", (req, res) => {
  res.send("Public route");
});

// Protected route
app.get("/profile", authenticate, (req, res) => {
  res.json(req.user);
});

// Admin route
app.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.send("Welcome Admin 🚀");
});

app.listen(3000, () => console.log("Server running"));
```

---

## Configuration Options

### `createAuth(options)`

| Option           | Type     | Description                                 |
| ---------------- | -------- | ------------------------------------------- |
| `jwtSecret`      | string   | Secret key for JWT verification             |
| `getUser`        | function | Function to fetch user by ID                |
| `tokenExtractor` | function | Custom token extractor                      |
| `tokenSources`   | array    | Token sources (`header`, `cookie`, `query`) |
| `checks`         | object   | Built-in & custom validation checks         |
| `onError`        | function | Custom error handler                        |
| `debug`          | boolean  | Enable debug logs                           |
| `strict`         | boolean  | Enforce strict validation                   |

---

## Example: Custom Checks

```js
createAuth({
  jwtSecret: "secret",
  getUser,
  checks: {
    custom: (user) => {
      if (!user.isActive) {
        throw new Error("User inactive");
      }
    },
  },
});
```

---

## Authorization (RBAC)

```js
authorize("admin");
```

### Multiple roles

```js
authorize(["admin", "moderator"]);
```

### Role hierarchy

```js
authorize({
  allow: ["moderator"],
  allowHierarchy: true,
});
```

---

## Token Sources

```js
createAuth({
  tokenSources: ["header", "cookie", "query"],
});
```

---

## Debug Mode

```js
createAuth({
  debug: true,
});
```

---

## Error Handling

### Default handler

```js
import { defaultErrorHandler } from "@goelharshit006/auth-kit";

app.use(defaultErrorHandler);
```

### Custom handler

```js
createAuth({
  onError: (err, req, res) => {
    res.status(401).json({ message: err.message });
  },
});
```

---

## Project Structure

```
express-auth-kit/
├── src/
│   ├── core/
│   ├── middleware/
│   ├── errors/
│   └── index.js
```

---

## Why Auth Kit?

* No forced database or ORM
* No assumptions about user schema
* Fully customizable
* Easily reusable across projects

---

## Future Improvements

* Refresh token support
* Rate limiting integration
* OAuth strategies
* Logging hooks

---

## Author

**Harshit Goel**

---

## License

ISC

````

---

👉 “v2 me kya killer feature add kare”
👉 main tujhe aisa idea dunga jo tera package standout kar de 🚀
