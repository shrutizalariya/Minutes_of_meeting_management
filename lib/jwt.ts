import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

export function signJwt(payload: object, expiresIn: string = "1h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
