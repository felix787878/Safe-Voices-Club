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
  const heatLayerRef = useRef<L.Layer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [incidentType, setIncidentType] = useState(INCIDENT_TYPES[0]);
  const [description, setDescription] = useState("");
  const [incidentTime, setIncidentTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [reportLocation, setReportLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [placingPin, setPlacingPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      heatLayerRef.current = null;
      markersRef.current = null;
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  const toggleHeatmap = async () => {
    const map = mapInstance.current;
    if (!map) return;

    if (showHeatmap && heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
      setShowHeatmap(false);
    } else {
      const incidents = await fetchIncidentReports(30);
      if (incidents.length > 0) {
        const { loadHeatPlugin, createHeatLayer } = await import("@/lib/leaflet-heat");
        await loadHeatPlugin();
        const heatData = incidents.map((i: IncidentReport) => [
          i.latitude,
          i.longitude,
          0.5,
        ] as [number, number, number]);
        heatLayerRef.current = createHeatLayer(heatData, {
          radius: 25,
          blur: 15,
        }).addTo(map);
      }
      setShowHeatmap(true);
    }
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
    setPlacingPin(true);
    const map = mapInstance.current;
    if (!map) return;

    const handler = (e: L.LeafletMouseEvent) => {
      setReportLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      setPlacingPin(false);
      map.off("click", handler);
    };
    map.on("click", handler);
  };

  const handleSubmit = async () => {
    if (!reportLocation) {
      alert("Pilih lokasi kejadian terlebih dahulu.");
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

      <button
        onClick={toggleHeatmap}
        className="absolute top-3 right-3 z-[1000] rounded-lg bg-white px-3 py-2 text-xs font-medium shadow-md dark:bg-gray-900 min-h-[44px]"
      >
        {showHeatmap ? "Sembunyikan Heatmap" : "Tampilkan Zona Rawan"}
      </button>

      <div className="absolute bottom-20 right-3 z-[1000] rounded-lg bg-white/95 p-3 text-xs shadow-md dark:bg-gray-900/95 max-w-[200px]">
        <p>🔴 Kejadian darurat (24 jam)</p>
        <p>🟠 Laporan pelecehan</p>
        <p>🟡 Zona rawan (heatmap)</p>
      </div>

      <button
        onClick={() => setDialogOpen(true)}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg min-h-[44px]"
      >
        + Laporkan Kejadian
      </button>

      {toast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1001] rounded-lg bg-safe text-white px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                onChange={(e) => setIncidentTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Lokasi</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={detectLocation}>
                  Deteksi Otomatis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={enablePinPlacement}
                  className={placingPin ? "ring-2 ring-primary" : ""}
                >
                  {placingPin ? "Ketuk peta..." : "Pilih di Peta"}
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
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
