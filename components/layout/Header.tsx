"use client";

import { useAuthStore } from "@/providers/auth-store-provider";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

export default function Header() {
  const { accessToken, isHydrated, clearAccessToken } = useAuthStore(
    (state) => state,
  );

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2">
        <Link href="/" className="font-bold">
          {" "}
          웹프레임워크{" "}
        </Link>

        <nav className="flex items-center gap-2">
          {!isHydrated ? (
            <></>
          ) : accessToken ? (
            <>
              <Link href="/me" className={buttonVariants({ variant: "ghost" })}>
                내정보
              </Link>
              <Button onClick={() => clearAccessToken()}>로그아웃</Button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className={buttonVariants({ variant: "ghost" })}
              >
                회원가입
              </Link>
              <Link href="/login" className={buttonVariants()}>
                로그인
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
