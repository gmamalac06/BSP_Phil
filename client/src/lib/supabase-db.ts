/**
 * Supabase Database Service Layer
 * Provides direct database access functions replacing Express API calls
 */
import { supabase } from "./supabase";
import type {
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
};

// ============== UNITS ==============
export const unitsService = {
    async getAll(): Promise<Unit[]> {
        const { data, error } = await supabase
            .from("units")
            .select("*, school:schools(*)")
            .order("name");
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
};

// ============== ACTIVITIES ==============
export const activitiesService = {
    async getAll(): Promise<Activity[]> {
        const { data, error } = await supabase
            .from("activities")
            .select("*")
            .order("date", { ascending: false });
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
};

// ============== ANNOUNCEMENTS ==============
export const announcementsService = {
    async getAll(): Promise<Announcement[]> {
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });
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
};
