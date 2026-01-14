/**
 * Safe date formatting utilities
 * Handles date parsing from various sources (Supabase, API, etc.)
 * with fallback for invalid dates
 */
import { format, formatDistanceToNow } from "date-fns";

/**
 * Safely parse a date from various input formats
 * Handles both camelCase and snake_case date strings from Supabase
 * Treats timestamps without timezone as UTC (Supabase default)
 */
export function safeParseDate(dateInput: unknown): Date | null {
    if (dateInput === null || dateInput === undefined || dateInput === "") return null;

    try {
        // If it's already a Date object
        if (dateInput instanceof Date) {
            return isNaN(dateInput.getTime()) ? null : dateInput;
        }

        // If it's a string, handle Supabase timestamp format
        if (typeof dateInput === "string") {
            let dateStr = dateInput;

            // If the timestamp has no timezone indicator, treat it as UTC
            // Supabase often returns timestamps like "2026-01-14 11:16:00" or "2026-01-14T11:16:00"
            // Without a Z or +00:00, JavaScript interprets these as local time
            if (!dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-', 10)) {
                // Replace space with T if needed and append Z for UTC
                dateStr = dateStr.replace(' ', 'T');
                if (!dateStr.endsWith('Z')) {
                    dateStr = dateStr + 'Z';
                }
            }

            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? null : date;
        }

        // If it's a number (timestamp), parse it
        const date = new Date(dateInput as number);
        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
}

/**
 * Safely format a date using date-fns format
 * @param dateInput - The date to format (string, Date, or timestamp)
 * @param formatString - date-fns format string (default: "PPP")
 * @param fallback - Fallback string if date is invalid (default: "Unknown date")
 */
export function safeFormat(
    dateInput: unknown,
    formatString: string = "PPP",
    fallback: string = "Unknown date"
): string {
    const date = safeParseDate(dateInput);
    if (!date) return fallback;

    try {
        return format(date, formatString);
    } catch {
        return fallback;
    }
}

/**
 * Safely format a date as relative time (e.g., "2 days ago")
 * @param dateInput - The date to format
 * @param fallback - Fallback string if date is invalid
 */
export function safeFormatDistanceToNow(
    dateInput: unknown,
    fallback: string = "Unknown"
): string {
    const date = safeParseDate(dateInput);
    if (!date) return fallback;

    try {
        return formatDistanceToNow(date, { addSuffix: true });
    } catch {
        return fallback;
    }
}

/**
 * Safely get year from a date
 */
export function safeGetYear(dateInput: unknown, fallback: number = new Date().getFullYear()): number {
    const date = safeParseDate(dateInput);
    return date ? date.getFullYear() : fallback;
}

/**
 * Safely format date for display in forms (YYYY-MM-DD)
 */
export function safeDateToInputFormat(dateInput: unknown): string {
    const date = safeParseDate(dateInput);
    if (!date) return "";

    try {
        return date.toISOString().split('T')[0];
    } catch {
        return "";
    }
}

/**
 * Safely format date for locale display
 */
export function safeToLocaleDateString(dateInput: unknown, fallback: string = "Unknown"): string {
    const date = safeParseDate(dateInput);
    if (!date) return fallback;

    try {
        return date.toLocaleDateString();
    } catch {
        return fallback;
    }
}
