import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <ul className="mt-6 flex flex-col gap-2">
        <li>
          <Link href="/admin/events" className="hover:underline">
            Gestisci eventi
          </Link>
        </li>
        <li>
          <Link href="/admin/news" className="hover:underline">
            Gestisci news
          </Link>
        </li>
      </ul>
    </div>
  );
}
