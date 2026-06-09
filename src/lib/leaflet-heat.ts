import L from "leaflet";

let loaded = false;

export async function loadHeatPlugin(): Promise<void> {
  if (loaded) return;
  await import("leaflet.heat");
  loaded = true;
}

export function createHeatLayer(
  data: Array<[number, number, number]>,
  options?: { radius?: number; blur?: number; maxZoom?: number }
): L.Layer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (L as any).heatLayer(data, options);
}
