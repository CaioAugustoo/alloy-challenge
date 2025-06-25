export class Email {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValid();
  }

  static create(value: string): Email {
    return new Email(value);
  }

  getValue(): string {
    return this.value;
  }

  private ensureIsValid(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error(`Invalid email format: ${this.value}`);
    }
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
