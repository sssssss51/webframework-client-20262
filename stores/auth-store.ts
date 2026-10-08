import { createStore } from "zustand/vanilla";

// Hydration
// 서버가 만든 HTML에 브라우저의 React 동작을 연결해 상호작용 가능한 화면으로 만드는 과정
// 예) 새로고침
// 1. 새로고침으로 기존 js 메모리가 사라진다.
// 2. Zustand 저장소가 새로 만들어진다. 이 때, accessToken은 null (초기값)
// 3. 브라우저에는 쿠키에 accessToken 저장되어 있음
// 4. Provider의 useEffect에서 쿠키를 읽는다.
// 5. 읽은 토큰을 Zustand에 넣는다.

export type AuthState = {
  accessToken: string | null;
  isHydrated: boolean; // 쿠키에 저장된 토큰을 Zustand에 복원하는 작업이 끝났는가?
  setAccessToken: (token: string, expiresIn: number) => void;
  restoreAccessToken: () => void;
  clearAccessToken: () => void;
};

const COOKIE_NAME = "accessToken";

function cookieOptions() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  return `Path=/; SameSite=Lax${secure}`;
}

export function createAuthStore() {
  return createStore<AuthState>()((set) => ({
    accessToken: null,
    isHydrated: false,
    setAccessToken: (token, expiresIn) => {
      document.cookie =
        `${COOKIE_NAME}=${encodeURIComponent(token)}; ` +
        `Max-Age=${Math.max(0, Math.floor(expiresIn))}; ${cookieOptions()}`;

      set({ accessToken: token, isHydrated: true });
    },

    restoreAccessToken: () => {
      const cookie = document.cookie
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${COOKIE_NAME}=`));

      let token: string | null = null;
      try {
        token = cookie
          ? decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1))
          : null;
      } catch {
        document.cookie = `${COOKIE_NAME}=; Max-Age=0; ${cookieOptions()}`;
      }

      set({ accessToken: token, isHydrated: true });
    },

    clearAccessToken: () => {
      document.cookie = `${COOKIE_NAME}=; Max-Age=0; ${cookieOptions()}`;

      set({ accessToken: null, isHydrated: true });
    },
  }));
}
