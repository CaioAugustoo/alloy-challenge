export type SignUpDTOInput = {
  email: string;
  name: string;
  password: string;
};

export type SignUpDTOOutput =
  | {
      accessToken: string;
    }
  | {
      error: string;
    };
