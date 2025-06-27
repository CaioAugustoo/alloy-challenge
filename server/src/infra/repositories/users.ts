import { User } from "../../domain/entities/user";
import type { Database } from "../database/database";
import type { UsersRepository as UsersRepositoryInterface } from "../../domain/repositories/users";

export class UsersRepository implements UsersRepositoryInterface {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<User | undefined> {
    const foundUser = await this.db.query<User | undefined>(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (!foundUser) {
      return;
    }

    const user = User.createFromPersistence(foundUser);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.db.query<User | undefined>(
      "SELECT id, name, password, email, created_at, updated_at FROM users WHERE email = $1",
      [email]
    );

    if (!foundUser) {
      return;
    }

    const user = User.createFromPersistence(foundUser);
    return user;
  }

  async create(user: User): Promise<void> {
    const data = user.toPersistence();
    await this.db.query<User>(
      "INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        data.id,
        data.name,
        data.email,
        data.password,
        data.createdAt,
        data.updatedAt,
      ]
    );
  }
}
