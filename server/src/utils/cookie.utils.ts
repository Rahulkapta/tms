// utils/cookie.utils.ts

import { CookieOptions } from "express";

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production, false in dev
  sameSite: "strict", // helps mitigate CSRF (optional)
};
