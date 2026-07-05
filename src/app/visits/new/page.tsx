import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { listParks } from "@/server/services/parks";
import { LogVisitForm } from "./log-visit-form";

export default async function NewVisitPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parks = await listParks();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Log a visit</h1>
      <LogVisitForm
        parks={parks.map((p) => ({ id: p.id, slug: p.slug, name: p.name }))}
        username={user.username ?? ""}
      />
    </div>
  );
}
