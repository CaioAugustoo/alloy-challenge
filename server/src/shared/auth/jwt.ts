import jwt, { SignOptions } from "jsonwebtoken";
import type { TokenProvider } from "./token-provider";

export class JWTProvider implements TokenProvider {
  constructor(private readonly secret: string) {}

  sign(payload: Record<string, any>, expiresInSeconds: number): string {
    const options: SignOptions = { expiresIn: expiresInSeconds };
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): Record<string, any> {
    try {
      return jwt.verify(token, this.secret) as Record<string, any>;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
