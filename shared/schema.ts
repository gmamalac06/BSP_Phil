import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - integrates with Supabase Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // UUID from Supabase Auth
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  role: text("role").notNull().default("user"), // admin, staff, unit_leader, scout, user
  isApproved: boolean("is_approved").notNull().default(false), // Whether the user is approved by admin
  schoolId: varchar("school_id"), // For staff - which school they belong to
  unitId: varchar("unit_id"), // For unit_leader - which unit they lead
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schools table
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  municipality: text("municipality").notNull(),
  principal: text("principal"),
  logo: text("logo"), // URL to school logo in storage
  schoolNumber: text("school_number"), // School identification number
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Units table
export const units = pgTable("units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  leader: text("leader").notNull(),
  schoolId: varchar("school_id").references(() => schools.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Scouts table
export const scouts = pgTable("scouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  uid: text("uid").notNull().unique(), // BSP-2024-001234
  name: text("name").notNull(),
  unitId: varchar("unit_id").references(() => units.id, { onDelete: "set null" }),
  schoolId: varchar("school_id").references(() => schools.id, { onDelete: "set null" }),
  municipality: text("municipality").notNull(),
  gender: text("gender").notNull(), // Male, Female, Other
  status: text("status").notNull().default("pending"), // active, pending, expired
  membershipYears: integer("membership_years").default(0),
  dateOfBirth: timestamp("date_of_birth"),
  address: text("address"),
  parentGuardian: text("parent_guardian"),
  contactNumber: text("contact_number"),
  email: text("email"),
  rank: text("rank"), // tenderfoot, second-class, first-class, eagle
  paymentProof: text("payment_proof"), // URL to payment proof file in storage
  profilePhoto: text("profile_photo"), // URL to profile photo in storage
  bloodType: text("blood_type"), // A+, B+, O+, AB+, A-, B-, O-, AB-
  emergencyContact: text("emergency_contact"), // Emergency contact phone number
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activities table
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date", { mode: 'string' }).notNull(),
  location: text("location").notNull(),
  latitude: text("latitude"), // Map coordinates (stored as text for precision)
  longitude: text("longitude"), // Map coordinates (stored as text for precision)
  capacity: integer("capacity").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, ongoing, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity Attendance junction table
export const activityAttendance = pgTable("activity_attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activityId: varchar("activity_id").references(() => activities.id, { onDelete: "cascade" }).notNull(),
  scoutId: varchar("scout_id").references(() => scouts.id, { onDelete: "cascade" }).notNull(),
  attended: boolean("attended").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // announcement, policy, event
  author: text("author").notNull(),
  eventDate: timestamp("event_date", { mode: 'string' }), // Optional date for event-type announcements
  eventTime: text("event_time"), // Optional time string (e.g., "2:00 PM")
  photo: text("photo"), // URL to announcement photo in storage
  smsNotified: boolean("sms_notified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reports table
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // enrollment, membership, activities
  recordCount: integer("record_count").default(0),
  generatedBy: varchar("generated_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  details: text("details").notNull(),
  category: text("category").notNull(), // create, update, delete, login, system
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert and Select Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertSchoolSchema = createInsertSchema(schools);
export const selectSchoolSchema = createSelectSchema(schools);

export const insertUnitSchema = createInsertSchema(units);
export const selectUnitSchema = createSelectSchema(units);

export const insertScoutSchema = createInsertSchema(scouts);
export const selectScoutSchema = createSelectSchema(scouts);

// Custom activity schema - manually defined to properly handle string dates
// (drizzle-zod's createInsertSchema doesn't respect mode: 'string' for timestamps)
export const insertActivitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"), // Accept ISO string from client
  location: z.string().min(1, "Location is required"),
  latitude: z.string().nullable().optional(), // Map coordinates
  longitude: z.string().nullable().optional(), // Map coordinates
  capacity: z.number().min(1, "Capacity must be at least 1"),
  status: z.string().default("upcoming"),
  createdAt: z.date().optional(),
});
export const selectActivitySchema = createSelectSchema(activities);

export const insertActivityAttendanceSchema = createInsertSchema(activityAttendance);
export const selectActivityAttendanceSchema = createSelectSchema(activityAttendance);

export const insertAnnouncementSchema = createInsertSchema(announcements);
export const selectAnnouncementSchema = createSelectSchema(announcements);

export const insertReportSchema = createInsertSchema(reports);
export const selectReportSchema = createSelectSchema(reports);

export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const selectAuditLogSchema = createSelectSchema(auditLogs);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;

export type Scout = typeof scouts.$inferSelect;
export type InsertScout = z.infer<typeof insertScoutSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type ActivityAttendance = typeof activityAttendance.$inferSelect;
export type InsertActivityAttendance = z.infer<typeof insertActivityAttendanceSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// Settings table - system configuration (admin only)
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // general, notifications, security, backup
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  type: text("type").notNull(), // text, number, boolean, select
  updatedBy: varchar("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings);
export const selectSettingsSchema = createSelectSchema(settings);

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// Carousel Slides table - landing page event slides (admin configurable)
export const carouselSlides = pgTable("carousel_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(), // URL to slide image in storage
  linkUrl: text("link_url"), // Optional link when clicking the slide
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarouselSlideSchema = createInsertSchema(carouselSlides);
export const selectCarouselSlideSchema = createSelectSchema(carouselSlides);

export type CarouselSlide = typeof carouselSlides.$inferSelect;
export type InsertCarouselSlide = z.infer<typeof insertCarouselSlideSchema>;
