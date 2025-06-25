import { Hasher } from "../../shared/hashing/hashing";
import { Email } from "./email";
import { Password } from "./password";
import { v4 as uuid } from "uuid";

export class User {
  private constructor(
    public readonly id: string,
    public name: string,
    public email: Email,
    private password: Password,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  static async createNew(
    name: string,
    rawEmail: string,
    rawPassword: string,
    hasher: Hasher
  ): Promise<User> {
    if (name.trim() === "") throw new Error("Name cannot be empty");
    const email = new Email(rawEmail);

    const hashed = await hasher.hash(rawPassword);
    const password = Password.create(hashed);

    const now = new Date();
    return new User(uuid(), name, email, password, now, now);
  }

  static createFromPersistence(record: any): User {
    const email = new Email(record.email);
    const password = Password.create(record.password);

    return new User(
      record.id,
      record.name,
      email,
      password,
      record.createdAt,
      record.updatedAt
    );
  }

  async validatePassword(plain: string, hasher: Hasher): Promise<boolean> {
    return hasher.compare(plain, this.password.getHashed());
  }

  toPersistence(): any {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      password: this.password.getHashed(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
