export interface CreateUserUseCase {
  execute(data: CreateUserUseCase.Params): Promise<CreateUserUseCase.Response>;
}

export namespace CreateUserUseCase {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = {
    accessToken: string;
  };
}
