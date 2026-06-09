"use client";

import { useRouter } from "next/navigation";

export function QuickExit() {
  const router = useRouter();

  const handleQuickExit = () => {
    router.push("/cuaca");
  };

  return (
    <button
      onClick={handleQuickExit}
      className="fixed bottom-20 left-3 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gray-200/80 text-gray-600 backdrop-blur-sm hover:bg-gray-300 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600 text-lg"
      aria-label="Pengaturan"
      title="Pengaturan"
    >
      ⚙️
    </button>
  );
}
