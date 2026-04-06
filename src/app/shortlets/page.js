import { Suspense } from "react";
import ShortletsClient from "./ShortletsClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading shortlets...</div>}>
      <ShortletsClient />
    </Suspense>
  );
}