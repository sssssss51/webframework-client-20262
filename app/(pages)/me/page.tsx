"use client";

import { getMe } from "@/lib/api/user-account";
import { useAuthStore } from "@/providers/auth-store-provider";
import { MeResult } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [result, setResult] = useState<MeResult | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    async function loadme() {
      try {
        const data = await getMe(accessToken as string);
        setResult({
          token: accessToken as string,
          data: data,
        });
      } catch (error) {
        setResult({
          token: accessToken as string,
          data: null,
          error:
            error instanceof Error ? error.message : "서버 연결을 확인하세요.",
        });
      }
    }
    loadme();
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div>
        <Link href="/login"> 로그인으로 이동하기 </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold"> 내 정보 </h1>

      <div className="space-y-2 rounded-lg border p-6">
        <p>회원ID : {result?.data?.id}</p>
        <p>이메일 : {result?.data?.email}</p>
        <p>닉네임 : {result?.data?.nickname}</p>
        <p>에러 : {result?.error}</p>
      </div>
    </div>
  );
}
