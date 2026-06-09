"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle, Mic, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getEmergencyContacts,
  getSessionId,
  saveRecording,
} from "@/lib/storage";
import { getWhatsAppLink } from "@/lib/phone";
import { insertPanicEvent, resolvePanicEvent } from "@/lib/supabase";
import { formatRecordingCountdown } from "@/lib/format";

type ActionStatus = "pending" | "success" | "error" | "loading";

interface PanicOverlayProps {
  onDismiss: () => void;
}

export function PanicOverlay({ onDismiss }: PanicOverlayProps) {
  const [countdown, setCountdown] = useState(3);
  const [callStatus, setCallStatus] = useState<ActionStatus>("pending");
  const [locationStatus, setLocationStatus] = useState<ActionStatus>("loading");
  const [whatsappStatus, setWhatsappStatus] = useState<ActionStatus>("pending");
  const [recordingStatus, setRecordingStatus] = useState<ActionStatus>("loading");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapsLink, setMapsLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [recordingTime, setRecordingTime] = useState(120);
  const [panicEventId, setPanicEventId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeRef = useRef(120);
  const countdownDone = useRef(false);

  const contacts = getEmergencyContacts();

  const stopRecording = useCallback(() => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleSafe = useCallback(async () => {
    stopRecording();
    if (panicEventId) {
      await resolvePanicEvent(panicEventId);
    }
    onDismiss();
  }, [stopRecording, panicEventId, onDismiss]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!countdownDone.current) {
            countdownDone.current = true;
            setCallStatus("success");
            window.location.href = "tel:112";
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        const link = `https://maps.google.com/?q=${lat},${lng}`;
        setMapsLink(link);
        setLocationStatus("success");

        const sessionId = getSessionId();
        const eventId = await insertPanicEvent(sessionId, lat, lng);
        if (eventId) setPanicEventId(eventId);
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (countdown <= 1 && contacts.length > 0) {
      setWhatsappStatus("success");
    } else if (contacts.length === 0) {
      setWhatsappStatus("error");
    }
  }, [countdown, contacts.length]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingStatus("error");
      return;
    }

    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

        if (!MediaRecorder.isTypeSupported(mimeType)) {
          setRecordingStatus("error");
          return;
        }

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const duration = 120 - recordingTimeRef.current;
          try {
            await saveRecording(blob, duration);
            setRecordingStatus("success");
          } catch {
            setRecordingStatus("error");
          }
        };

        recorder.start(1000);
        setRecordingStatus("loading");

        recordingIntervalRef.current = setInterval(() => {
          recordingTimeRef.current -= 1;
          setRecordingTime(recordingTimeRef.current);
          if (recordingTimeRef.current <= 0) {
            stopRecording();
          }
        }, 1000);
      })
      .catch(() => setRecordingStatus("error"));

    return () => {
      mounted = false;
      stopRecording();
    };
  }, [stopRecording]);

  const openWhatsApp = (phone: string) => {
    const locationPart = mapsLink
      ? ` Lokasi: ${mapsLink}`
      : "";
    const message = `DARURAT! Saya merasa terancam. Tolong hubungi saya.${locationPart}`;
    window.open(getWhatsAppLink(phone, message), "_blank");
  };

  const copyCoords = async () => {
    if (!coords) return;
    await navigator.clipboard.writeText(`${coords.lat}, ${coords.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusIcon = (status: ActionStatus) => {
    if (status === "loading") return "⏳";
    if (status === "success") return "✓";
    if (status === "error") return "✗";
    return "⏳";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gradient-to-b from-danger to-red-900 text-white overflow-y-auto"
    >
      <div className="flex flex-col items-center px-4 py-8 min-h-screen">
        <div className="text-center mb-6">
          <p className="text-lg opacity-90">Menghubungi 112 (Darurat Nasional)...</p>
          {countdown > 0 ? (
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold my-4"
            >
              {countdown}
            </motion.div>
          ) : (
            <p className="text-2xl font-bold my-4">Hubungi sekarang</p>
          )}
          <p className="text-sm opacity-80">
            Satu ketukan untuk terhubung ke layanan darurat
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
          {[
            { icon: Phone, label: "Panggilan", status: callStatus },
            { icon: MapPin, label: "Lokasi", status: locationStatus },
            { icon: MessageCircle, label: "WhatsApp", status: whatsappStatus },
            { icon: Mic, label: "Rekaman", status: recordingStatus },
          ].map(({ icon: Icon, label, status }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-3 backdrop-blur-sm"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm flex-1">{label}</span>
              <span className="text-lg">{statusIcon(status)}</span>
            </div>
          ))}
        </div>

        {locationStatus === "success" && coords && (
          <div className="w-full max-w-sm mb-4 rounded-xl bg-white/15 p-4 backdrop-blur-sm">
            <p className="text-sm mb-2">
              📍 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyCoords}
              className="w-full text-gray-900"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Tersalin!" : "Salin Koordinat"}
            </Button>
          </div>
        )}

        {locationStatus === "error" && (
          <p className="text-sm mb-4 text-center opacity-90">
            Lokasi tidak tersedia — izinkan akses lokasi
          </p>
        )}

        {recordingStatus === "loading" && (
          <div className="flex items-center gap-2 mb-4">
            <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
            <span className="text-sm">
              Merekam: {formatRecordingCountdown(recordingTime)}
            </span>
          </div>
        )}

        {recordingStatus === "error" && (
          <p className="text-sm mb-4 text-center opacity-90">
            Mikrofon tidak tersedia — izinkan akses mikrofon di pengaturan browser
          </p>
        )}

        <Button
          variant="secondary"
          size="lg"
          className="w-full max-w-sm mb-4 text-gray-900 font-bold"
          onClick={() => { window.location.href = "tel:110"; }}
        >
          HUBUNGI 110 (POLISI)
        </Button>

        <div className="w-full max-w-sm space-y-2 mb-6">
          {contacts.length === 0 ? (
            <p className="text-sm text-center opacity-90">
              Belum ada kontak darurat — tambahkan di Beranda
            </p>
          ) : (
            contacts.map((contact, i) => (
              <Button
                key={contact.id}
                variant="secondary"
                className="w-full text-gray-900"
                onClick={() => openWhatsApp(contact.phone)}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp {contact.name}
                {i === 0 && countdown <= 1 && (
                  <span className="text-xs opacity-70">(utama)</span>
                )}
              </Button>
            ))
          )}
        </div>

        <Button
          variant="success"
          size="lg"
          className="w-full max-w-sm font-bold text-lg"
          onClick={handleSafe}
        >
          SAYA SUDAH AMAN
        </Button>
      </div>
    </motion.div>
  );
}
