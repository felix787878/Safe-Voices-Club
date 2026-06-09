"use client";

import { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { RecordingCard } from "@/components/RecordingCard";
import {
  getRecordings,
  deleteRecording,
  getStorageUsagePercent,
  type RecordingData,
} from "@/lib/storage";

export default function RekamanPage() {
  const [recordings, setRecordings] = useState<
    Array<{ key: string; recording: RecordingData }>
  >([]);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    setRecordings(getRecordings());
    setStorageWarning(getStorageUsagePercent() > 80);
  }, []);

  const handleDelete = (key: string) => {
    deleteRecording(key);
    setRecordings(getRecordings());
    setStorageWarning(getStorageUsagePercent() > 80);
  };

  return (
    <div className="px-4 py-4">
      {storageWarning && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          Penyimpanan hampir penuh — hapus rekaman lama
        </div>
      )}

      <h1 className="text-xl font-bold text-primary mb-4">Rekaman Bukti</h1>

      {recordings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Mic className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-xs">
            Belum ada rekaman. Rekaman akan muncul di sini setelah kamu
            mengaktifkan mode panik.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recordings.map(({ key, recording }) => (
            <RecordingCard
              key={key}
              storageKey={key}
              recording={recording}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
