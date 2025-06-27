export type SignInDTOInput = {
  email: string;
  password: string;
};

export type SignInDTOOutput =
  | {
      accessToken: string;
    }
  | {
      error: string;
    };
