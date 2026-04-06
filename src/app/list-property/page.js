import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ListPropertyClient from "./ListPropertyClient";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }


  const safeUser = JSON.parse(JSON.stringify(user));

  return <ListPropertyClient user={safeUser} />;
}