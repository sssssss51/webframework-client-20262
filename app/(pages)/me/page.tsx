"use client";

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
        const response = await fetch("http://localhost:8080/user-account/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("다시 시도해주세요");
          }
          if (response.status === 403) {
            throw new Error("접근 권한이 없습니다.");
          }

          throw new Error(`내 정보 조회 실패 ${response.status}`);
        }

        setResult({
          token: accessToken as string,
          data: await response.json(),
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
