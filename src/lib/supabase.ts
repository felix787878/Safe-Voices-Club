import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface PanicEvent {
  id: string;
  session_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  is_resolved: boolean;
}

export interface IncidentReport {
  id: string;
  incident_type: string;
  description: string | null;
  incident_time: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export async function insertPanicEvent(
  sessionId: string,
  latitude: number,
  longitude: number
): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("panic_events")
    .insert({ session_id: sessionId, latitude, longitude, is_resolved: false })
    .select("id")
    .single();
  if (error) return null;
  return data?.id ?? null;
}

export async function resolvePanicEvent(eventId: string): Promise<void> {
  if (!supabase || !eventId) return;
  await supabase
    .from("panic_events")
    .update({ is_resolved: true })
    .eq("id", eventId);
}

export async function fetchActivePanicEvents(): Promise<PanicEvent[]> {
  if (!supabase) return [];
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("panic_events")
    .select("*")
    .gt("created_at", since)
    .eq("is_resolved", false);
  if (error) return [];
  return data ?? [];
}

export async function fetchIncidentReports(days = 30): Promise<IncidentReport[]> {
  if (!supabase) return [];
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("incident_reports")
    .select("*")
    .gt("created_at", since);
  if (error) return [];
  return data ?? [];
}

export async function insertIncidentReport(report: {
  incident_type: string;
  description?: string;
  incident_time: string;
  latitude: number;
  longitude: number;
}): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("incident_reports").insert(report);
  return !error;
}
