export interface TokenProvider {
  sign(payload: Record<string, any>, expiresInSeconds: number): string;
  verify(token: string): Record<string, any>;
}
