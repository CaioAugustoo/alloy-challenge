export class Email {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    return new Email(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
