export const dynamic = "force-dynamic";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const safeUser = JSON.parse(JSON.stringify(user));

  return <DashboardClient user={safeUser} />;
}