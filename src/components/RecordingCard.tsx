"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecordingData } from "@/lib/storage";
import {
  formatIndonesianDate,
  formatDuration,
  formatFileSize,
} from "@/lib/format";

interface RecordingCardProps {
  storageKey: string;
  recording: RecordingData;
  onDelete: (key: string) => void;
}

function Waveform({ audioData }: { audioData: string }) {
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    const decode = async () => {
      try {
        const response = await fetch(audioData);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);
        const samples = 60;
        const blockSize = Math.floor(channelData.length / samples);
        const newPeaks: number[] = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[i * blockSize + j]);
          }
          newPeaks.push(sum / blockSize);
        }

        const max = Math.max(...newPeaks, 0.001);
        setPeaks(newPeaks.map((p) => p / max));
        audioContext.close();
      } catch {
        setPeaks(Array(60).fill(0.1));
      }
    };
    decode();
  }, [audioData]);

  const width = 200;
  const height = 40;
  const barWidth = width / peaks.length;

  return (
    <svg width={width} height={height} className="mx-auto">
      {peaks.map((peak, i) => (
        <rect
          key={i}
          x={i * barWidth}
          y={height / 2 - (peak * height) / 2}
          width={Math.max(barWidth - 1, 1)}
          height={Math.max(peak * height, 2)}
          fill="#6C3483"
          rx={1}
        />
      ))}
    </svg>
  );
}

export function RecordingCard({
  storageKey,
  recording,
  onDelete,
}: RecordingCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(recording.data);
      audioRef.current.onended = () => setPlaying(false);
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleDownload = () => {
    const date = new Date(recording.timestamp);
    const filename = `SafeVoicesClub_rekaman_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}.webm`;

    const link = document.createElement("a");
    link.href = recording.data;
    link.download = filename;
    link.click();
  };

  const handleDelete = () => {
    onDelete(storageKey);
    setConfirmOpen(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <p className="font-medium text-sm mb-1">
        {formatIndonesianDate(recording.timestamp)}
      </p>
      <p className="text-xs text-gray-500 mb-3">
        {formatDuration(recording.duration)} · {formatFileSize(recording.size)}
      </p>

      <Waveform audioData={recording.data} />

      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" onClick={togglePlay} className="flex-1">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Jeda" : "Putar"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4 text-danger" />
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Rekaman?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hapus rekaman ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
