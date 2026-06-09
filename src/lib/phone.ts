export function formatIndonesianPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  let normalized = digits;
  if (normalized.startsWith("62")) {
    normalized = normalized;
  } else if (normalized.startsWith("0")) {
    normalized = "62" + normalized.slice(1);
  } else if (normalized.startsWith("8")) {
    normalized = "62" + normalized;
  }

  return "+" + normalized;
}

export function isValidIndonesianMobile(phone: string): boolean {
  const formatted = formatIndonesianPhone(phone);
  return /^\+628\d{8,11}$/.test(formatted);
}

export function formatPhoneDisplay(phone: string): string {
  const formatted = formatIndonesianPhone(phone);
  if (!formatted) return "";
  const local = "0" + formatted.slice(3);
  if (local.length <= 4) return local;
  if (local.length <= 8) return `${local.slice(0, 4)}-${local.slice(4)}`;
  return `${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8)}`;
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const formatted = formatIndonesianPhone(phone);
  const number = formatted.replace("+", "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
