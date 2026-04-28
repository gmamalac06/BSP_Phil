// Helpers for Scout ID generation and membership validity periods.
//
// Scout UID format:
//   BSP-{registrationYear}-{2randomDigits}{birthMM}{birthDD}{birthYYYY}
// Example:
//   Birthday: 1995-04-24 -> BSP-2026-87 04 24 1995  -> BSP-2026-8704241995
//   Last 8 digits encode the scout's birth month (MM), day (DD), and year (YYYY).
// Falls back to all-random suffix if no birth date is provided.

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
 * Generate a Scout UID whose final 8 digits encode birth month (2) + day (2) + year (4).
 * A 2-digit random prefix preserves uniqueness for scouts sharing the same birthday.
 */
export function generateScoutUid(dateOfBirth?: string | Date | null): string {
  const regYear = new Date().getFullYear();
  const rand = randomDigits(2);

  if (dateOfBirth) {
    const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const mm = pad2(dob.getMonth() + 1);
      const dd = pad2(dob.getDate());
      const yyyy = dob.getFullYear().toString();
      return `BSP-${regYear}-${rand}${mm}${dd}${yyyy}`;
    }
  }

  // Fallback: 10 random digits when birthdate is unavailable.
  return `BSP-${regYear}-${randomDigits(10)}`;
}

/**
 * Get the current rolling membership validity year range, e.g. "2026-2027".
 * Auto-rolls every calendar year.
 */
export function getCurrentValidityYear(now: Date = new Date()): string {
  const y = now.getFullYear();
  return `${y}-${y + 1}`;
}
