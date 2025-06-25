export class Password {
  constructor(private readonly hashed: string) {}

  getHashed(): string {
    return this.hashed;
  }

  static create(hashed: string): Password {
    return new Password(hashed);
  }
}
