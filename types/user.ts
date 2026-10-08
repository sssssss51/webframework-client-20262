export type MeResponse = {
  id: number;
  email: string;
  nickname: string;
};

export type MeResult = {
  token: string;
  data: MeResponse | null;
  error?: string;
};
