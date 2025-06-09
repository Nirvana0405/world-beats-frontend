import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logoutUser } from "@/lib/auth";

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    logoutUser(); // localStorage 削除＋リダイレクト処理
  };

  const linkStyle = "text-blue-600 hover:underline";

  return (
    <nav className="p-4 bg-gray-100 flex items-center justify-between">
      <ul className="flex gap-4 items-center">
        <li>
          <Link href="/" className={linkStyle}>
            ホーム
          </Link>
        </li>

        {loggedIn ? (
          <>
            <li>
              <Link href="/profile" className={linkStyle}>
                プロフィール
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                ログアウト
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login" className={linkStyle}>
              ログイン
            </Link>
          </li>
        )}
        <li>
          <Link href="/terms" className={linkStyle}>
            利用規約
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
