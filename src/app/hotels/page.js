import { Suspense } from "react";
import HotelsClient from "./HotelsClient";

export default function HotelsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading hotels...</div>}>
      <HotelsClient />
    </Suspense>
  );
}