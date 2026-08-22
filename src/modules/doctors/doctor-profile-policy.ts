const INFORMATIONAL_PROFILE_IDS = new Set(["manzoor-shahbaz"]);

export function canDoctorAcceptAppointments(doctorId: string): boolean {
  return !INFORMATIONAL_PROFILE_IDS.has(doctorId);
}
