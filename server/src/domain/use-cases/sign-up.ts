export interface SignUpUseCase {
  execute(data: SignUpUseCase.Params): Promise<SignUpUseCase.Response>;
}

export namespace SignUpUseCase {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = {
    accessToken: string;
  };
}
