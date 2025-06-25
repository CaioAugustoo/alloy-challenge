export interface TokenProvider {
  sign(payload: Record<string, any>, expiresInSeconds: number): string;
}
