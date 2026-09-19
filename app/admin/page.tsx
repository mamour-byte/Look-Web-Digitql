import type { Metadata } from "next";
import { isAdminPage } from "@/lib/auth";
import AdminLogin from "./login";
import AdminDashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminPage();

  if (!authed) {
    return (
      <main className="min-h-screen w-full bg-white text-ink">
        <AdminLogin />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-ink">
      <AdminDashboard />
    </main>
  );
}