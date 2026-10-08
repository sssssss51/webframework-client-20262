"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/providers/auth-store-provider";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    setErrorMessage("");
    clearAccessToken();

    try {
      const response = await fetch("http://localhost:8080/user-account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setErrorMessage(`로그인에 실패하였습니다. (${response.status})`);
        return;
      }

      const data: LoginResponse = await response.json();
      setAccessToken(data.accessToken, data.expiresIn);
      form.reset();
    } catch {
      setErrorMessage("서버와 통신 중 에러가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isSubmitting}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
            )}

            {accessToken && (
              <p className="text-sm text-green-700 font-medium break-all">
                로그인 성공: {accessToken}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
