export const STORAGE_KEYS = {
  ONBOARDING: "SafeVoicesClub_onboarding_complete",
  CONTACTS: "SafeVoicesClub_emergency_contacts",
  SESSION_ID: "SafeVoicesClub_session_id",
  INSTALL_DISMISSED: "SafeVoicesClub_install_dismissed",
  RECORDING_PREFIX: "SafeVoicesClub_recording_",
} as const;

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface RecordingData {
  data: string;
  duration: number;
  size: number;
  timestamp: string;
}

export function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getSessionId(): string {
  if (!isClient()) return "";
  let id = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, id);
  }
  return id;
}

export function isOnboardingComplete(): boolean {
  if (!isClient()) return false;
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === "true";
}

export function setOnboardingComplete(): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, "true");
}

export function getEmergencyContacts(): EmergencyContact[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEmergencyContacts(contacts: EmergencyContact[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
}

export function getRecordings(): Array<{ key: string; recording: RecordingData }> {
  if (!isClient()) return [];
  const recordings: Array<{ key: string; recording: RecordingData }> = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEYS.RECORDING_PREFIX)) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          recordings.push({ key, recording: JSON.parse(data) });
        }
      } catch {
        // skip corrupt entries
      }
    }
  }

  return recordings.sort(
    (a, b) =>
      new Date(b.recording.timestamp).getTime() -
      new Date(a.recording.timestamp).getTime()
  );
}

export function saveRecording(
  blob: Blob,
  duration: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const timestamp = new Date().toISOString();
      const key = `${STORAGE_KEYS.RECORDING_PREFIX}${timestamp}`;
      const data: RecordingData = {
        data: reader.result as string,
        duration,
        size: blob.size,
        timestamp,
      };
      try {
        localStorage.setItem(key, JSON.stringify(data));
        resolve(key);
      } catch {
        reject(new Error("Penyimpanan perangkat penuh. Hapus rekaman lama untuk melanjutkan."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function deleteRecording(key: string): void {
  if (!isClient()) return;
  localStorage.removeItem(key);
}

export function getStorageUsagePercent(): number {
  if (!isClient()) return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += (localStorage.getItem(key)?.length ?? 0) * 2;
    }
  }
  const limit = 5 * 1024 * 1024;
  return (total / limit) * 100;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getNameColor(name: string): string {
  const colors = [
    "#6C3483",
    "#27AE60",
    "#E67E22",
    "#3498DB",
    "#9B59B6",
    "#1ABC9C",
    "#E74C3C",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
