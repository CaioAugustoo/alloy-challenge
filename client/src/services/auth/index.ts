import { env } from "../../env";
import type { SignInDTOInput, SignInDTOOutput } from "./sign-in-dto";
import type { SignUpDTOInput, SignUpDTOOutput } from "./sign-up-dto";

export class AuthService {
  async signIn(dto: SignInDTOInput): Promise<SignInDTOOutput> {
    const response = await fetch(`${env.apiURL}/signin`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dto),
    });

    const json = (await response.json()) as SignInDTOOutput;
    if ("error" in json) {
      throw new Error(json.error);
    }
    return json;
  }

  async signUp(dto: SignUpDTOInput): Promise<SignUpDTOOutput> {
    const response = await fetch(`${env.apiURL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    const json = (await response.json()) as SignUpDTOOutput;
    if ("error" in json) {
      throw new Error(json.error);
    }

    return json;
  }
}
