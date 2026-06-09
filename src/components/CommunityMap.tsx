"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  fetchActivePanicEvents,
  fetchIncidentReports,
  insertIncidentReport,
  type PanicEvent,
  type IncidentReport,
} from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const JAKARTA_CENTER: [number, number] = [-6.2088, 106.8456];

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const INCIDENT_TYPES = [
  "Catcalling",
  "Penguntitan",
  "Pelecehan fisik",
  "Pelecehan digital",
  "Eksibisionisme",
  "Intimidasi",
  "Lainnya",
];

function createPulseIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 16px; height: 16px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 0 0 ${color};
      animation: pulse-marker 1.5s infinite;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function CommunityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const pinHandlerRef = useRef<((e: L.LeafletMouseEvent) => void) | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [incidentType, setIncidentType] = useState(INCIDENT_TYPES[0]);
  const [description, setDescription] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [maxIncidentTime, setMaxIncidentTime] = useState("");
  const [timeError, setTimeError] = useState("");
  const [reportLocation, setReportLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [placingPin, setPlacingPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const showMapControls = !dialogOpen && !placingPin;

  useEffect(() => {
    const container = mapRef.current;
    if (!container || mapInstance.current) return;

    // Hindari double-init jika container sudah dipakai Leaflet
    if ((container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) {
      return;
    }

    const map = L.map(container, { center: JAKARTA_CENTER, zoom: 13 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    let cancelled = false;

    const loadMapData = async () => {
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
            });
          });
          if (!cancelled) {
            map.setView([pos.coords.latitude, pos.coords.longitude], 13);
          }
        } catch {
          // tetap gunakan Jakarta sebagai default
        }
      }

      const [panicEvents, incidents] = await Promise.all([
        fetchActivePanicEvents(),
        fetchIncidentReports(30),
      ]);

      if (cancelled || !markersRef.current) return;

      panicEvents.forEach((event: PanicEvent) => {
        L.marker([event.latitude, event.longitude], {
          icon: createPulseIcon("#E74C3C"),
        })
          .bindPopup(
            `🚨 Laporan Darurat — ${formatRelativeTime(event.created_at)}`
          )
          .addTo(markersRef.current!);
      });

      incidents.forEach((incident: IncidentReport) => {
        L.marker([incident.latitude, incident.longitude], {
          icon: createPulseIcon("#E67E22"),
        })
          .bindPopup(`${incident.incident_type}`)
          .addTo(markersRef.current!);
      });
    };

    loadMapData();

    return () => {
      cancelled = true;
      markersRef.current = null;
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  const openReportDialog = () => {
    const now = new Date();
    setIncidentTime(toDatetimeLocal(now));
    setMaxIncidentTime(toDatetimeLocal(now));
    setTimeError("");
    setDialogOpen(true);
  };

  const cancelPinPlacement = () => {
    const map = mapInstance.current;
    if (map && pinHandlerRef.current) {
      map.off("click", pinHandlerRef.current);
      pinHandlerRef.current = null;
    }
    setPlacingPin(false);
    setDialogOpen(true);
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setReportLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Lokasi tidak dapat diakses.")
    );
  };

  const enablePinPlacement = () => {
    const map = mapInstance.current;
    if (!map) return;

    setDialogOpen(false);
    setPlacingPin(true);

    const handler = (e: L.LeafletMouseEvent) => {
      setReportLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      setPlacingPin(false);
      map.off("click", handler);
      pinHandlerRef.current = null;
      const now = new Date();
      setIncidentTime(toDatetimeLocal(now));
      setMaxIncidentTime(toDatetimeLocal(now));
      setDialogOpen(true);
    };

    pinHandlerRef.current = handler;
    map.on("click", handler);
  };

  const handleIncidentTimeChange = (value: string) => {
    setIncidentTime(value);
    const selected = new Date(value);
    const now = new Date();
    if (selected > now) {
      setTimeError("Waktu kejadian tidak boleh melebihi waktu sekarang.");
    } else {
      setTimeError("");
    }
  };

  const handleSubmit = async () => {
    if (!reportLocation) {
      alert("Pilih lokasi kejadian terlebih dahulu.");
      return;
    }

    const selectedTime = new Date(incidentTime);
    const now = new Date();
    if (selectedTime > now) {
      setTimeError("Waktu kejadian tidak boleh melebihi waktu sekarang.");
      return;
    }

    setSubmitting(true);
    const success = await insertIncidentReport({
      incident_type: incidentType,
      description: description || undefined,
      incident_time: new Date(incidentTime).toISOString(),
      latitude: reportLocation.lat,
      longitude: reportLocation.lng,
    });

    setSubmitting(false);

    if (success) {
      setToast("Laporan berhasil dikirim. Terima kasih.");
      setDialogOpen(false);
      setDescription("");
      setReportLocation(null);

      if (markersRef.current) {
        L.marker([reportLocation.lat, reportLocation.lng], {
          icon: createPulseIcon("#E67E22"),
        })
          .bindPopup(incidentType)
          .addTo(markersRef.current);
      }

      setTimeout(() => setToast(""), 3000);
    } else {
      alert(
        "Data tidak dapat dikirim ke peta komunitas saat ini. Fitur lain tetap berfungsi."
      );
    }
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] w-full">
      <style>{`
        @keyframes pulse-marker {
          0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
          100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
      `}</style>

      <div ref={mapRef} className="h-full w-full z-0" />

      {showMapControls && (
        <button
          onClick={openReportDialog}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg min-h-[44px]"
        >
          + Laporkan Kejadian
        </button>
      )}

      {placingPin && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-2 w-[90%] max-w-sm">
          <div className="rounded-xl bg-primary text-white px-4 py-3 text-sm text-center shadow-lg w-full">
            Ketuk peta untuk memilih lokasi kejadian
          </div>
          <Button variant="secondary" size="sm" onClick={cancelPinPlacement}>
            Batal
          </Button>
        </div>
      )}

      {toast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1001] rounded-lg bg-safe text-white px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setTimeError("");
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Laporkan Kejadian</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Jenis Kejadian
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              >
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Deskripsi (opsional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                maxLength={200}
                rows={3}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                placeholder="Ceritakan kejadian..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/200
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Waktu Kejadian
              </label>
              <Input
                type="datetime-local"
                value={incidentTime}
                max={maxIncidentTime}
                onChange={(e) => handleIncidentTimeChange(e.target.value)}
              />
              {timeError && (
                <p className="text-xs text-danger mt-1">{timeError}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Lokasi</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={detectLocation}>
                  Deteksi Otomatis
                </Button>
                <Button variant="outline" size="sm" onClick={enablePinPlacement}>
                  Pilih di Peta
                </Button>
              </div>
              {reportLocation && (
                <p className="text-xs text-gray-500 mt-1">
                  📍 {reportLocation.lat.toFixed(5)}, {reportLocation.lng.toFixed(5)}
                </p>
              )}
            </div>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submitting || !!timeError}
            >
              {submitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
