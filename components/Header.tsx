// components/Header.tsx（例）
import Link from "next/link";
import { useUnreadCount } from "../hooks/useUnreadCount";

export default function Header() {
  const unreadCount = useUnreadCount();

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">WORLD BEATS</div>
      <nav className="flex gap-4">
        <Link href="/dms">DM</Link>
        <Link href="/notifications" className="relative">
          通知
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
