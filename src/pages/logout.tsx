// pages/logout.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("access_token");
    router.push("/login");
  }, [router]);

  return <p>ログアウト中...</p>;
}
