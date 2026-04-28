/**
 * Audit logging helper.
 *
 * Use logAudit({ action, details, category }) from anywhere — it grabs the
 * current Supabase user and writes a row into `audit_logs`. It NEVER throws
 * so a failure to log can't block the user's actual action.
 *
 * Categories follow the values surfaced in the audit-trail UI:
 *   create | update | delete | login | system
 */
import { supabase } from "./supabase";

export type AuditCategory = "create" | "update" | "delete" | "login" | "system";

export interface AuditEntryInput {
    action: string;
    details: string;
    category: AuditCategory;
    /** Optional explicit user id; falls back to the current session user. */
    userId?: string | null;
}

export async function logAudit(entry: AuditEntryInput): Promise<void> {
    try {
        let userId: string | null = entry.userId ?? null;
        if (userId === null) {
            const { data } = await supabase.auth.getUser();
            userId = data.user?.id ?? null;
        }

        const { error } = await supabase.from("audit_logs").insert({
            user_id: userId,
            action: entry.action,
            details: entry.details,
            category: entry.category,
        });

        if (error) {
            // eslint-disable-next-line no-console
            console.warn("[audit] insert failed:", error.message);
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[audit] unexpected error:", err);
    }
}

/** Best-effort log; returns immediately, never awaits. */
export function logAuditFireAndForget(entry: AuditEntryInput): void {
    void logAudit(entry);
}
