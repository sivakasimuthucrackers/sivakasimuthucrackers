import { Suspense } from "react";
import TrackOrderClient from "./TrackOrderClient";

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 text-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-pink-500" />
        <p className="mt-4 text-sm text-gray-400">Loading order tracking...</p>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TrackOrderClient />
    </Suspense>
  );
}
