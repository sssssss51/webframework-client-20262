import { MeResponse } from "@/types/user";
import { apiFetch } from "./http";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiFetch("user-account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function getMe(accessToken: string): Promise<MeResponse> {
  const response = await apiFetch("user-account/me", {
    accessToken,
  });

  return response.json();
}
