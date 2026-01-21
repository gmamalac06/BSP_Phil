import { z } from "zod";

// Helper for nullable optional fields
const nullableString = z.string().nullable().optional();
const nullableNumber = z.number().nullable().optional();
const nullableDate = z.string().or(z.date()).nullable().optional();

// -----------------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------------
export const selectUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.string().default("user"),
  isApproved: z.boolean().default(false),
  schoolId: nullableString,
  unitId: nullableString,
  createdAt: z.string().or(z.date()).optional(),
});

export const insertUserSchema = selectUserSchema.extend({
  id: z.string().optional(),
  isApproved: z.boolean().optional(),
  role: z.string().optional(),
});

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// -----------------------------------------------------------------------------
// Schools
// -----------------------------------------------------------------------------
export const selectSchoolSchema = z.object({
  id: z.string(),
  name: z.string(),
  municipality: z.string(),
  principal: nullableString,
  logo: nullableString,
  schoolNumber: nullableString,
  createdAt: z.string().or(z.date()).optional(),
});

export const insertSchoolSchema = selectSchoolSchema.extend({
  id: z.string().optional(),
});

export type School = z.infer<typeof selectSchoolSchema>;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

// -----------------------------------------------------------------------------
// Units
// -----------------------------------------------------------------------------
export const selectUnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  leader: z.string(),
  schoolId: nullableString,
  status: z.string().default("active"),
  createdAt: z.string().or(z.date()).optional(),
});

export const insertUnitSchema = selectUnitSchema.extend({
  id: z.string().optional(),
  status: z.string().optional(),
});

export type Unit = z.infer<typeof selectUnitSchema>;
export type InsertUnit = z.infer<typeof insertUnitSchema>;

// -----------------------------------------------------------------------------
// Scouts
// -----------------------------------------------------------------------------
export const selectScoutSchema = z.object({
  id: z.string(),
  uid: z.string(),
  name: z.string(),
  unitId: nullableString,
  schoolId: nullableString,
  municipality: z.string(),
  gender: z.string(),
  status: z.string().default("pending"),
  membershipYears: nullableNumber.default(0),
  dateOfBirth: nullableDate,
  address: nullableString,
  parentGuardian: nullableString,
  contactNumber: nullableString,
  email: nullableString,
  rank: nullableString,
  paymentProof: nullableString,
  profilePhoto: nullableString,
  bloodType: nullableString,
  emergencyContact: nullableString,
  createdAt: z.string().or(z.date()).optional(),
});

export const insertScoutSchema = selectScoutSchema.extend({
  id: z.string().optional(),
  uid: z.string().optional(), // Often generated server-side
  status: z.string().optional(),
  membershipYears: z.number().optional(),
});

export type Scout = z.infer<typeof selectScoutSchema>;
export type InsertScout = z.infer<typeof insertScoutSchema>;

// -----------------------------------------------------------------------------
// Activities
// -----------------------------------------------------------------------------
export const selectActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(), // Kept as string to match original behavior
  location: z.string(),
  latitude: nullableString,
  longitude: nullableString,
  capacity: z.number().int(),
  status: z.string().default("upcoming"),
  createdAt: z.string().or(z.date()).optional(),
});

// Custom manually defined insert schema to match original logic
export const insertActivitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  latitude: nullableString,
  longitude: nullableString,
  capacity: z.number().min(1, "Capacity must be at least 1"),
  status: z.string().default("upcoming"),
  createdAt: z.date().optional(),
});

export type Activity = z.infer<typeof selectActivitySchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// -----------------------------------------------------------------------------
// Activity Attendance
// -----------------------------------------------------------------------------
export const selectActivityAttendanceSchema = z.object({
  id: z.string(),
  activityId: z.string(),
  scoutId: z.string(),
  attended: z.boolean().default(false),
  createdAt: z.string().or(z.date()).optional(),
});

export const insertActivityAttendanceSchema = selectActivityAttendanceSchema.extend({
  id: z.string().optional(),
  attended: z.boolean().optional(),
});

export type ActivityAttendance = z.infer<typeof selectActivityAttendanceSchema>;
export type InsertActivityAttendance = z.infer<typeof insertActivityAttendanceSchema>;

// -----------------------------------------------------------------------------
// Announcements
// -----------------------------------------------------------------------------
export const selectAnnouncementSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.string(),
  author: z.string(),
  eventDate: nullableDate,
  eventTime: nullableString,
  photo: nullableString,
  smsNotified: z.boolean().default(false),
  createdAt: z.string().or(z.date()).optional(),
});

export const insertAnnouncementSchema = selectAnnouncementSchema.extend({
  id: z.string().optional(),
  smsNotified: z.boolean().optional(),
});

export type Announcement = z.infer<typeof selectAnnouncementSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// -----------------------------------------------------------------------------
// Reports
// -----------------------------------------------------------------------------
export const selectReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  recordCount: nullableNumber.default(0),
  generatedBy: nullableString,
  createdAt: z.string().or(z.date()).optional(),
});

export const insertReportSchema = selectReportSchema.extend({
  id: z.string().optional(),
  recordCount: z.number().optional(),
});

export type Report = z.infer<typeof selectReportSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;

// -----------------------------------------------------------------------------
// Audit Logs
// -----------------------------------------------------------------------------
export const selectAuditLogSchema = z.object({
  id: z.string(),
  userId: nullableString,
  action: z.string(),
  details: z.string(),
  category: z.string(),
  ipAddress: nullableString,
  createdAt: z.string().or(z.date()).optional(),
});

export const insertAuditLogSchema = selectAuditLogSchema.extend({
  id: z.string().optional(),
});

export type AuditLog = z.infer<typeof selectAuditLogSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------
export const selectSettingsSchema = z.object({
  id: z.string(),
  category: z.string(),
  key: z.string(),
  value: z.string(),
  label: z.string(),
  description: nullableString,
  type: z.string(),
  updatedBy: nullableString,
  updatedAt: z.string().or(z.date()).optional(),
});

export const insertSettingsSchema = selectSettingsSchema.extend({
  id: z.string().optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type Settings = z.infer<typeof selectSettingsSchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// -----------------------------------------------------------------------------
// Carousel Slides
// -----------------------------------------------------------------------------
export const selectCarouselSlideSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: nullableString,
  image_url: z.string(),
  link_url: nullableString,
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  created_by: nullableString,
  created_at: z.string().or(z.date()).optional(),
});

export const insertCarouselSlideSchema = selectCarouselSlideSchema.extend({
  id: z.string().optional(),
  display_order: z.number().optional(),
  is_active: z.boolean().optional(),
});

export type CarouselSlide = z.infer<typeof selectCarouselSlideSchema>;
export type InsertCarouselSlide = z.infer<typeof insertCarouselSlideSchema>;
