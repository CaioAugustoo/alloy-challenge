export interface SignInUseCase {
  execute(data: SignInUseCase.Params): Promise<SignInUseCase.Response>;
}

export namespace SignInUseCase {
  export type Params = {
    email: string;
    password: string;
  };

  export type Response = {
    accessToken: string;
  };
}
