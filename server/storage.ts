import { db } from "./db";
import { eq, and, desc, count, sql } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Scout,
  type InsertScout,
  type School,
  type InsertSchool,
  type Unit,
  type InsertUnit,
  type Activity,
  type InsertActivity,
  type Announcement,
  type InsertAnnouncement,
  type Report,
  type InsertReport,
  type AuditLog,
  type InsertAuditLog,
  type ActivityAttendance,
  type InsertActivityAttendance,
  type Settings,
  type InsertSettings,
  users,
  scouts,
  schools,
  units,
  activities,
  announcements,
  reports,
  auditLogs,
  activityAttendance,
  settings,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  getPendingUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;

  // Scouts
  getScout(id: string): Promise<Scout | undefined>;
  getScoutByUid(uid: string): Promise<Scout | undefined>;
  getAllScouts(): Promise<Scout[]>;
  getScoutsByStatus(status: string): Promise<Scout[]>;
  getScoutsBySchool(schoolId: string): Promise<Scout[]>;
  getScoutsByUnit(unitId: string): Promise<Scout[]>;
  createScout(scout: InsertScout): Promise<Scout>;
  updateScout(id: string, scout: Partial<InsertScout>): Promise<Scout | undefined>;
  deleteScout(id: string): Promise<boolean>;
  getScoutsCount(): Promise<number>;

  // Schools
  getSchool(id: string): Promise<School | undefined>;
  getAllSchools(): Promise<School[]>;
  getSchoolByName(name: string): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: string, school: Partial<InsertSchool>): Promise<School | undefined>;
  deleteSchool(id: string): Promise<boolean>;

  // Units
  getUnit(id: string): Promise<Unit | undefined>;
  getAllUnits(): Promise<Unit[]>;
  getUnitsBySchool(schoolId: string): Promise<Unit[]>;
  getUnitsByStatus(status: string): Promise<Unit[]>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit | undefined>;
  deleteUnit(id: string): Promise<boolean>;

  // Activities
  getActivity(id: string): Promise<Activity | undefined>;
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByStatus(status: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: string): Promise<boolean>;
  getUpcomingActivitiesCount(): Promise<number>;

  // Activity Attendance
  markAttendance(attendance: InsertActivityAttendance): Promise<ActivityAttendance>;
  getActivityAttendance(activityId: string): Promise<ActivityAttendance[]>;
  getScoutAttendance(scoutId: string): Promise<ActivityAttendance[]>;

  // Announcements
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByType(type: string): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;

  // Reports
  getReport(id: string): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  getReportsByCategory(category: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: string): Promise<AuditLog[]>;
  getAuditLogsByCategory(category: string): Promise<AuditLog[]>;

  // Settings
  getSetting(key: string): Promise<Settings | undefined>;
  getAllSettings(): Promise<Settings[]>;
  getSettingsByCategory(category: string): Promise<Settings[]>;
  updateSetting(key: string, value: string, updatedBy?: string): Promise<Settings | undefined>;
  createSetting(setting: InsertSettings): Promise<Settings>;
  initializeDefaultSettings(): Promise<void>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalScouts: number;
    activeScouts: number;
    pendingScouts: number;
    upcomingActivities: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getPendingUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isApproved, false)).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Scouts
  async getScout(id: string): Promise<Scout | undefined> {
    const result = await db.select().from(scouts).where(eq(scouts.id, id)).limit(1);
    return result[0];
  }

  async getScoutByUid(uid: string): Promise<Scout | undefined> {
    const result = await db.select().from(scouts).where(eq(scouts.uid, uid)).limit(1);
    return result[0];
  }

  async getAllScouts(): Promise<Scout[]> {
    return await db.select().from(scouts).orderBy(desc(scouts.createdAt));
  }

  async getScoutsByStatus(status: string): Promise<Scout[]> {
    return await db.select().from(scouts).where(eq(scouts.status, status)).orderBy(desc(scouts.createdAt));
  }

  async getScoutsBySchool(schoolId: string): Promise<Scout[]> {
    return await db.select().from(scouts).where(eq(scouts.schoolId, schoolId)).orderBy(desc(scouts.createdAt));
  }

  async getScoutsByUnit(unitId: string): Promise<Scout[]> {
    return await db.select().from(scouts).where(eq(scouts.unitId, unitId)).orderBy(desc(scouts.createdAt));
  }

  async createScout(insertScout: InsertScout): Promise<Scout> {
    const result = await db.insert(scouts).values(insertScout).returning();
    return result[0];
  }

  async updateScout(id: string, scoutData: Partial<InsertScout>): Promise<Scout | undefined> {
    const result = await db.update(scouts).set(scoutData).where(eq(scouts.id, id)).returning();
    return result[0];
  }

  async deleteScout(id: string): Promise<boolean> {
    const result = await db.delete(scouts).where(eq(scouts.id, id)).returning();
    return result.length > 0;
  }

  async getScoutsCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(scouts);
    return result[0]?.count || 0;
  }

  // Schools
  async getSchool(id: string): Promise<School | undefined> {
    const result = await db.select().from(schools).where(eq(schools.id, id)).limit(1);
    return result[0];
  }

  async getAllSchools(): Promise<School[]> {
    return await db.select().from(schools).orderBy(desc(schools.createdAt));
  }

  async getSchoolByName(name: string): Promise<School | undefined> {
    const result = await db.select().from(schools).where(eq(schools.name, name)).limit(1);
    return result[0];
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const result = await db.insert(schools).values(insertSchool).returning();
    return result[0];
  }

  async updateSchool(id: string, schoolData: Partial<InsertSchool>): Promise<School | undefined> {
    const result = await db.update(schools).set(schoolData).where(eq(schools.id, id)).returning();
    return result[0];
  }

  async deleteSchool(id: string): Promise<boolean> {
    const result = await db.delete(schools).where(eq(schools.id, id)).returning();
    return result.length > 0;
  }

  // Units
  async getUnit(id: string): Promise<Unit | undefined> {
    const result = await db.select().from(units).where(eq(units.id, id)).limit(1);
    return result[0];
  }

  async getAllUnits(): Promise<Unit[]> {
    return await db.select().from(units).orderBy(desc(units.createdAt));
  }

  async getUnitsBySchool(schoolId: string): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.schoolId, schoolId)).orderBy(desc(units.createdAt));
  }

  async getUnitsByStatus(status: string): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.status, status)).orderBy(desc(units.createdAt));
  }

  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const result = await db.insert(units).values(insertUnit).returning();
    return result[0];
  }

  async updateUnit(id: string, unitData: Partial<InsertUnit>): Promise<Unit | undefined> {
    const result = await db.update(units).set(unitData).where(eq(units.id, id)).returning();
    return result[0];
  }

  async deleteUnit(id: string): Promise<boolean> {
    const result = await db.delete(units).where(eq(units.id, id)).returning();
    return result.length > 0;
  }

  // Activities
  async getActivity(id: string): Promise<Activity | undefined> {
    const result = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
    return result[0];
  }

  async getAllActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.date));
  }

  async getActivitiesByStatus(status: string): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.status, status)).orderBy(desc(activities.date));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(insertActivity).returning();
    return result[0];
  }

  async updateActivity(id: string, activityData: Partial<InsertActivity>): Promise<Activity | undefined> {
    const result = await db.update(activities).set(activityData).where(eq(activities.id, id)).returning();
    return result[0];
  }

  async deleteActivity(id: string): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id)).returning();
    return result.length > 0;
  }

  async getUpcomingActivitiesCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(activities).where(eq(activities.status, 'upcoming'));
    return result[0]?.count || 0;
  }

  // Activity Attendance
  async markAttendance(attendance: InsertActivityAttendance): Promise<ActivityAttendance> {
    const result = await db.insert(activityAttendance).values(attendance).returning();
    return result[0];
  }

  async getActivityAttendance(activityId: string): Promise<ActivityAttendance[]> {
    return await db.select().from(activityAttendance).where(eq(activityAttendance.activityId, activityId));
  }

  async getScoutAttendance(scoutId: string): Promise<ActivityAttendance[]> {
    return await db.select().from(activityAttendance).where(eq(activityAttendance.scoutId, scoutId));
  }

  // Announcements
  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    const result = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return result[0];
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async getAnnouncementsByType(type: string): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.type, type)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(insertAnnouncement).returning();
    return result[0];
  }

  async updateAnnouncement(id: string, announcementData: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const result = await db.update(announcements).set(announcementData).where(eq(announcements.id, id)).returning();
    return result[0];
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    return result.length > 0;
  }

  // Reports
  async getReport(id: string): Promise<Report | undefined> {
    const result = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
    return result[0];
  }

  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getReportsByCategory(category: string): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.category, category)).orderBy(desc(reports.createdAt));
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(insertReport).returning();
    return result[0];
  }

  // Audit Logs
  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values(insertLog).returning();
    return result[0];
  }

  async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }

  async getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.createdAt));
  }

  async getAuditLogsByCategory(category: string): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).where(eq(auditLogs.category, category)).orderBy(desc(auditLogs.createdAt));
  }

  // Settings
  async getSetting(key: string): Promise<Settings | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return result[0];
  }

  async getAllSettings(): Promise<Settings[]> {
    return await db.select().from(settings).orderBy(settings.category, settings.key);
  }

  async getSettingsByCategory(category: string): Promise<Settings[]> {
    return await db.select().from(settings).where(eq(settings.category, category)).orderBy(settings.key);
  }

  async updateSetting(key: string, value: string, updatedBy?: string): Promise<Settings | undefined> {
    const result = await db
      .update(settings)
      .set({ value, updatedBy: updatedBy || null, updatedAt: new Date() })
      .where(eq(settings.key, key))
      .returning();
    return result[0];
  }

  async createSetting(setting: InsertSettings): Promise<Settings> {
    const result = await db.insert(settings).values(setting).returning();
    return result[0];
  }

  async initializeDefaultSettings(): Promise<void> {
    const existingSettings = await this.getAllSettings();
    if (existingSettings.length > 0) return;

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
      await this.createSetting(setting);
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalScouts: number;
    activeScouts: number;
    pendingScouts: number;
    upcomingActivities: number;
  }> {
    const [totalScoutsResult] = await db.select({ count: count() }).from(scouts);
    const [activeScoutsResult] = await db.select({ count: count() }).from(scouts).where(eq(scouts.status, 'active'));
    const [pendingScoutsResult] = await db.select({ count: count() }).from(scouts).where(eq(scouts.status, 'pending'));
    const [upcomingActivitiesResult] = await db.select({ count: count() }).from(activities).where(eq(activities.status, 'upcoming'));

    return {
      totalScouts: totalScoutsResult?.count || 0,
      activeScouts: activeScoutsResult?.count || 0,
      pendingScouts: pendingScoutsResult?.count || 0,
      upcomingActivities: upcomingActivitiesResult?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
