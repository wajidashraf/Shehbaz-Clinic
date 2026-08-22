export const verifiedLegacyDoctorIdPairs = [
  ["sobia-ahmad", "sobia-zulfiqar"],
  ["amna-rauf", "amna-baig"],
  ["ahmad", "ahmed-mobeen"],
  ["shahbaz", "manzoor-shahbaz"],
] as const;

const legacyDoctorIds = new Map<string, string>(verifiedLegacyDoctorIdPairs);

export function canonicalDoctorId(doctorId: string): string {
  return legacyDoctorIds.get(doctorId) ?? doctorId;
}
