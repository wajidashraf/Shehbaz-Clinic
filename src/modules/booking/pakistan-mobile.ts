export function normalizePakistanMobile(value: string): string | null {
  const compact = value.trim().replace(/[ -]/g, "");

  if (/^03\d{9}$/.test(compact)) {
    return `+92${compact.slice(1)}`;
  }

  return /^\+923\d{9}$/.test(compact) ? compact : null;
}
