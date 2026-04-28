// Helpers for Scout ID generation and membership validity periods.
//
// Scout UID format:
//   BSP-{registrationYear}-{birthMM}{birthDD}{birthYY}-{2 random digits}
// Example:
//   Birthday: 1995-04-24 -> BSP-2026-042495-87
// The first 6 digits of the trailing block encode the scout's birth date
// (MMDDYY). The trailing 2-digit random suffix prevents UID collisions for
// scouts sharing the same birthday.
// Falls back to a single 8-digit random block if no birth date is provided.

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function randomDigits(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += Math.floor(Math.random() * 10).toString();
  }
  return out;
}

/**
 * Generate a Scout UID whose final 6 digits encode birth month (2) + day (2) + 2-digit year (2).
 */
export function generateScoutUid(dateOfBirth?: string | Date | null): string {
  const regYear = new Date().getFullYear();
  const rand = randomDigits(2);

  if (dateOfBirth) {
    const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const mm = pad2(dob.getMonth() + 1);
      const dd = pad2(dob.getDate());
      const yy = pad2(dob.getFullYear() % 100);
      return `BSP-${regYear}-${mm}${dd}${yy}-${rand}`;
    }
  }

  // Fallback: 8 random digits when birthdate is unavailable.
  return `BSP-${regYear}-${randomDigits(8)}`;
}

/**
 * Get the current rolling membership validity year range, e.g. "2026-2027".
 * Auto-rolls every calendar year.
 */
export function getCurrentValidityYear(now: Date = new Date()): string {
  const y = now.getFullYear();
  return `${y}-${y + 1}`;
}
