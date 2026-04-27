// Helpers for Scout ID generation and membership validity periods.
//
// Scout UID format:
//   BSP-{registrationYear}-{4randomDigits}{birthDD}{birthYYYY}
// Examples:
//   Birthday: 1995-04-24 -> BSP-2026-9482241995
//   Last 6 digits encode the scout's full birth day (DD) + birth year (YYYY).
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
 * Generate a Scout UID whose final 6 digits encode the birth day (2) + birth year (4).
 */
export function generateScoutUid(dateOfBirth?: string | Date | null): string {
  const regYear = new Date().getFullYear();
  const rand = randomDigits(4);

  if (dateOfBirth) {
    const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const dd = pad2(dob.getDate());
      const yyyy = dob.getFullYear().toString();
      return `BSP-${regYear}-${rand}${dd}${yyyy}`;
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
