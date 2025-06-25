export interface Database {
  connect(): Promise<this>;
  query<T>(query: string, params?: any[]): Promise<T>;
  close(): Promise<void>;
}
