/**
 * Supabase Database Service Layer
 * Provides direct database access functions replacing Express API calls
 */
import { supabase } from "./supabase";
import type {
    User,
    InsertUser,
    Scout,
    InsertScout,
    School,
    InsertSchool,
    Unit,
    InsertUnit,
    Activity,
    InsertActivity,
    Announcement,
    InsertAnnouncement,
    Report,
    InsertReport,
    AuditLog,
    InsertAuditLog,
    Settings,
    InsertSettings,
    CarouselSlide,
    InsertCarouselSlide,
    ActivityAttendance,
    InsertActivityAttendance,
} from "@shared/schema";

// ============== SCHOOLS ==============
export const schoolsService = {
    async getAll(): Promise<School[]> {
        const { data, error } = await supabase
            .from("schools")
            .select("*")
            .order("name");
        if (error) throw new Error(error.message);
        return data || [];
    },

    async getById(id: string): Promise<School> {
        const { data, error } = await supabase
            .from("schools")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async create(school: InsertSchool): Promise<School> {
        const { data, error } = await supabase
            .from("schools")
            .insert(school)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async update(id: string, school: Partial<InsertSchool>): Promise<School> {
        const { data, error } = await supabase
            .from("schools")
            .update(school)
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from("schools").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },

    async getByName(name: string): Promise<School | undefined> {
        const { data, error } = await supabase
            .from("schools")
            .select("*")
            .eq("name", name)
            .single();
        if (error && error.code !== "PGRST116") throw new Error(error.message);
        return data;
    },
};

// ============== UNITS ==============
export const unitsService = {
    async getAll(filters?: { schoolId?: string; status?: string }): Promise<Unit[]> {
        let query = supabase
            .from("units")
            .select("*, school:schools(*)")
            .order("name");

        if (filters?.schoolId) query = query.eq("school_id", filters.schoolId);
        if (filters?.status) query = query.eq("status", filters.status);

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data || [];
    },

    async getById(id: string): Promise<Unit> {
        const { data, error } = await supabase
            .from("units")
            .select("*, school:schools(*)")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async create(unit: InsertUnit): Promise<Unit> {
        const { data, error } = await supabase
            .from("units")
            .insert(unit)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async update(id: string, unit: Partial<InsertUnit>): Promise<Unit> {
        const { data, error } = await supabase
            .from("units")
            .update(unit)
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from("units").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },
};

// ============== SCOUTS ==============
export const scoutsService = {
    async getAll(filters?: {
        status?: string;
        schoolId?: string;
        unitId?: string;
    }): Promise<Scout[]> {
        let query = supabase
            .from("scouts")
            .select("*, unit:units(*), school:schools(*)")
            .order("name");

        if (filters?.status && filters.status !== "all") {
            query = query.eq("status", filters.status);
        }
        if (filters?.schoolId) {
            query = query.eq("school_id", filters.schoolId);
        }
        if (filters?.unitId) {
            query = query.eq("unit_id", filters.unitId);
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data || [];
    },

    async getById(id: string): Promise<Scout> {
        const { data, error } = await supabase
            .from("scouts")
            .select("*, unit:units(*), school:schools(*)")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async getByUid(uid: string): Promise<Scout | null> {
        const { data, error } = await supabase
            .from("scouts")
            .select("*, unit:units(*), school:schools(*)")
            .eq("uid", uid)
            .single();
        if (error && error.code !== "PGRST116") throw new Error(error.message);
        return data;
    },

    async create(scout: InsertScout): Promise<Scout> {
        const { data, error } = await supabase
            .from("scouts")
            .insert(scout)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async update(id: string, scout: Partial<InsertScout>): Promise<Scout> {
        const { data, error } = await supabase
            .from("scouts")
            .update(scout)
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from("scouts").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },

    async getCount(): Promise<number> {
        const { count, error } = await supabase
            .from("scouts")
            .select("*", { count: "exact", head: true });
        if (error) throw new Error(error.message);
        return count || 0;
    },
};

// ============== ACTIVITIES ==============
export const activitiesService = {
    async getAll(filters?: { status?: string }): Promise<Activity[]> {
        let query = supabase
            .from("activities")
            .select("*")
            .order("date", { ascending: false });

        if (filters?.status) query = query.eq("status", filters.status);

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data || [];
    },

    async getById(id: string): Promise<Activity> {
        const { data, error } = await supabase
            .from("activities")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async create(activity: InsertActivity): Promise<Activity> {
        const { data, error } = await supabase
            .from("activities")
            .insert(activity)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async update(id: string, activity: Partial<InsertActivity>): Promise<Activity> {
        const { data, error } = await supabase
            .from("activities")
            .update(activity)
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from("activities").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },

    async getUpcomingCount(): Promise<number> {
        const { count, error } = await supabase
            .from("activities")
            .select("*", { count: "exact", head: true })
            .eq("status", "upcoming");
        if (error) throw new Error(error.message);
        return count || 0;
    },
};

// ============== ACTIVITY ATTENDANCE ==============
export const attendanceService = {
    async getByActivity(activityId: string): Promise<ActivityAttendance[]> {
        const { data, error } = await supabase
            .from("activity_attendance")
            .select("*, scout:scouts(*)")
            .eq("activity_id", activityId);
        if (error) throw new Error(error.message);
        return data || [];
    },

    async register(activityId: string, scoutId: string): Promise<ActivityAttendance> {
        const { data, error } = await supabase
            .from("activity_attendance")
            .insert({ activity_id: activityId, scout_id: scoutId, attended: false })
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updateAttendance(id: string, attended: boolean): Promise<ActivityAttendance> {
        const { data, error } = await supabase
            .from("activity_attendance")
            .update({ attended })
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async remove(activityId: string, scoutId: string): Promise<void> {
        const { error } = await supabase
            .from("activity_attendance")
            .delete()
            .eq("activity_id", activityId)
            .eq("scout_id", scoutId);
        if (error) throw new Error(error.message);
    },

    async getByScout(scoutId: string): Promise<ActivityAttendance[]> {
        const { data, error } = await supabase
            .from("activity_attendance")
            .select("*, activity:activities(*)")
            .eq("scout_id", scoutId);
        if (error) throw new Error(error.message);
        return data || [];
    },
};

// ============== ANNOUNCEMENTS ==============
export const announcementsService = {
    async getAll(filters?: { type?: string }): Promise<Announcement[]> {
        let query = supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

        if (filters?.type) query = query.eq("type", filters.type);

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data || [];
    },

    async getById(id: string): Promise<Announcement> {
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async create(announcement: InsertAnnouncement): Promise<Announcement> {
        const { data, error } = await supabase
            .from("announcements")
            .insert(announcement)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async update(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement> {
        const { data, error } = await supabase
            .from("announcements")
            .update(announcement)
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from("announcements").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },
};

// ============== AUDIT LOGS ==============
export const auditService = {
    async getAll(): Promise<AuditLog[]> {
        const { data, error } = await supabase
            .from("audit_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);
        if (error) throw new Error(error.message);
        return data || [];
    },

    async create(log: InsertAuditLog): Promise<AuditLog> {
        const { data, error } = await supabase
            .from("audit_logs")
            .insert(log)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async getByUser(userId: string): Promise<AuditLog[]> {
        const { data, error } = await supabase
            .from("audit_logs")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
    },

    async getByCategory(category: string): Promise<AuditLog[]> {
        const { data, error } = await supabase
            .from("audit_logs")
            .select("*")
            .eq("category", category)
            .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
    },
};

// ============== SETTINGS ==============
export const settingsService = {
    async getAll(): Promise<Settings[]> {
        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .order("category");
        if (error) throw new Error(error.message);
        return data || [];
    },

    async update(id: string, value: string): Promise<Settings> {
        const { data, error } = await supabase
            .from("settings")
            .update({ value, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async get(key: string): Promise<Settings | undefined> {
        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .eq("key", key)
            .single();
        if (error && error.code !== "PGRST116") throw new Error(error.message);
        return data;
    },

    async getByCategory(category: string): Promise<Settings[]> {
        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .eq("category", category)
            .order("key");
        if (error) throw new Error(error.message);
        return data || [];
    },

    async create(setting: InsertSettings): Promise<Settings> {
        const { data, error } = await supabase
            .from("settings")
            .insert(setting)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async initializeDefaultSettings(): Promise<void> {
        const existing = await this.getAll();
        if (existing.length > 0) return;

        const defaultSettings: InsertSettings[] = [
            // General
            { category: "general", key: "system_name", value: "ScoutSmart", label: "System Name", type: "text" },
            { category: "general", key: "organization", value: "Boy Scouts of the Philippines", label: "Organization", type: "text" },
            { category: "general", key: "auto_generate_uid", value: "true", label: "Auto-generate Scout UIDs", description: "Automatically generate unique IDs for new scouts", type: "boolean" },
            { category: "general", key: "require_payment_proof", value: "true", label: "Require payment proof", description: "Make payment proof upload mandatory for registration", type: "boolean" },

            // Notifications
            { category: "notifications", key: "enable_sms", value: "true", label: "Enable SMS Notifications", description: "Send SMS alerts for announcements and updates", type: "boolean" },
            { category: "notifications", key: "activity_reminders", value: "true", label: "Activity Reminders", description: "Send reminders before activities and events", type: "boolean" },
            { category: "notifications", key: "enrollment_notifications", value: "true", label: "Enrollment Notifications", description: "Notify when new scouts are registered", type: "boolean" },
            { category: "notifications", key: "sms_sender", value: "BSP-ScoutSmart", label: "SMS Sender Name", type: "text" },

            // Security
            { category: "security", key: "enable_audit_trail", value: "true", label: "Enable Audit Trail", description: "Log all system activities and user actions", type: "boolean" },
            { category: "security", key: "two_factor_auth", value: "false", label: "Two-Factor Authentication", description: "Require 2FA for admin and staff accounts", type: "boolean" },
            { category: "security", key: "session_timeout", value: "30", label: "Session Timeout (minutes)", type: "number" },
            { category: "security", key: "min_password_length", value: "8", label: "Minimum Password Length", type: "number" },

            // Backup
            { category: "backup", key: "auto_backup", value: "true", label: "Enable Automatic Backups", description: "Automatically backup database at scheduled intervals", type: "boolean" },
            { category: "backup", key: "backup_frequency", value: "Daily at 2:00 AM", label: "Backup Frequency", type: "text" },
            { category: "backup", key: "retention_days", value: "30", label: "Retention Period (days)", type: "number" },
        ];

        for (const setting of defaultSettings) {
            await this.create(setting);
        }
    },
};

// ============== CAROUSEL SLIDES ==============
export const carouselService = {
    async getAll(): Promise<CarouselSlide[]> {
        const { data, error } = await supabase
            .from("carousel_slides")
            .select("*")
            .order("display_order");
        if (error) throw new Error(error.message);
        return data || [];
    },

    async getActive(): Promise<CarouselSlide[]> {
        const { data, error } = await supabase
            .from("carousel_slides")
            .select("*")
            .eq("is_active", true)
            .order("display_order");
        if (error) throw new Error(error.message);
        return data || [];
    },

    async create(slide: InsertCarouselSlide): Promise<CarouselSlide> {
        const { data, error } = await supabase
            .from("carousel_slides")
            .insert(slide)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async update(id: string, slide: Partial<InsertCarouselSlide>): Promise<CarouselSlide> {
        const { data, error } = await supabase
            .from("carousel_slides")
            .update(slide)
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from("carousel_slides").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },

    async reorder(id: string, direction: "up" | "down"): Promise<void> {
        const slides = await this.getAll();
        const currentIndex = slides.findIndex(s => s.id === id);

        if (currentIndex === -1) return;
        if (direction === "up" && currentIndex === 0) return;
        if (direction === "down" && currentIndex === slides.length - 1) return;

        const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        const currentSlide = slides[currentIndex];
        const swapSlide = slides[swapIndex];

        // Swap display orders - using internal update to avoid type issues with camelCase vs snake_case
        // We know the service.update handles the parameter object correctly now or relies on manual fix
        // But better to use supabase direct update for safety to ensure snake_case

        await supabase.from("carousel_slides").update({ display_order: swapSlide.display_order }).eq("id", currentSlide.id);
        await supabase.from("carousel_slides").update({ display_order: currentSlide.display_order }).eq("id", swapSlide.id);
    },
};

// ============== STATS ==============
export const statsService = {
    async getDashboardStats(): Promise<{
        totalScouts: number;
        activeScouts: number;
        pendingScouts: number;
        upcomingActivities: number;
    }> {
        // Get total scouts
        const { count: totalScouts } = await supabase
            .from("scouts")
            .select("*", { count: "exact", head: true });

        // Get active scouts
        const { count: activeScouts } = await supabase
            .from("scouts")
            .select("*", { count: "exact", head: true })
            .eq("status", "active");

        // Get pending scouts
        const { count: pendingScouts } = await supabase
            .from("scouts")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");

        // Get upcoming activities
        const { count: upcomingActivities } = await supabase
            .from("activities")
            .select("*", { count: "exact", head: true })
            .eq("status", "upcoming");

        return {
            totalScouts: totalScouts || 0,
            activeScouts: activeScouts || 0,
            pendingScouts: pendingScouts || 0,
            upcomingActivities: upcomingActivities || 0,
        };
    },
};

// ============== USERS ==============
export const usersService = {
    async getById(id: string) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();
        if (error && error.code !== "PGRST116") throw new Error(error.message);
        return data;
    },

    async getPendingApprovals() {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("is_approved", false)
            .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
    },

    async approve(id: string) {
        const { data, error } = await supabase
            .from("users")
            .update({ is_approved: true })
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updateRole(id: string, role: string) {
        const { data, error } = await supabase
            .from("users")
            .update({ role })
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },
    async updateUser(id: string, userData: Partial<InsertUser>) {
        const { data, error } = await supabase
            .from("users")
            .update(userData)
            .eq("id", id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from("users").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },

    async getUserByEmail(email: string) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
        if (error && error.code !== "PGRST116") throw new Error(error.message);
        return data;
    },
};

// ============== REPORTS ==============
export const reportsService = {
    async getAll(): Promise<Report[]> {
        const { data, error } = await supabase
            .from("reports")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
    },

    async create(report: InsertReport): Promise<Report> {
        const { data, error } = await supabase
            .from("reports")
            .insert(report)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from("reports").delete().eq("id", id);
        if (error) throw new Error(error.message);
    },

    async getById(id: string): Promise<Report | undefined> {
        const { data, error } = await supabase
            .from("reports")
            .select("*")
            .eq("id", id)
            .single();
        if (error && error.code !== "PGRST116") throw new Error(error.message);
        return data;
    },

    async getByCategory(category: string): Promise<Report[]> {
        const { data, error } = await supabase
            .from("reports")
            .select("*")
            .eq("category", category)
            .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
    },
};
