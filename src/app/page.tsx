import { Suspense } from "react";

import { OSShell } from "@/components/os/OSShell";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <OSShell />
    </Suspense>
  );
}
