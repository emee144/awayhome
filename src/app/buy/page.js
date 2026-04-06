import { Suspense } from "react";
import BuyClient from "./BuyClient";

export default function BuyPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading properties...</div>}>
      <BuyClient />
    </Suspense>
  );
}