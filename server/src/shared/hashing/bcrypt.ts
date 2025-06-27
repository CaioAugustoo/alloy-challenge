import bcrypt from "bcrypt";
import { Hasher } from "./hashing";

export class BcryptHasher implements Hasher {
  constructor(private readonly saltRounds: number) {}

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
