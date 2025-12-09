import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScoutSchema, insertSchoolSchema, insertUnitSchema, insertActivitySchema, insertAnnouncementSchema, insertReportSchema, insertAuditLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard Stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User Management Routes
  app.get("/api/users/pending", async (req: Request, res: Response) => {
    try {
      const users = await storage.getPendingUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:id/approve", async (req: Request, res: Response) => {
    try {
      const user = await storage.updateUser(req.params.id, { isApproved: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create audit log
      await storage.createAuditLog({
        userId: req.body.approvedBy || null,
        action: "Approved User",
        details: `Approved user registration: ${user.username} (${user.email})`,
        category: "update",
        ipAddress: req.ip,
      });

      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const deleted = await storage.deleteUser(req.params.id);

      // Create audit log
      await storage.createAuditLog({
        userId: req.body.deletedBy || null,
        action: "Deleted User",
        details: `Deleted user: ${user.username} (${user.email})`,
        category: "delete",
        ipAddress: req.ip,
      });

      res.json({ success: deleted });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Scouts Routes
  app.get("/api/scouts", async (req: Request, res: Response) => {
    try {
      const { status, schoolId, unitId } = req.query;
      let scouts;

      if (schoolId) {
        scouts = await storage.getScoutsBySchool(schoolId as string);
        if (status) { // Client might send both
          scouts = scouts.filter(s => s.status === status);
        }
      } else if (unitId) {
        scouts = await storage.getScoutsByUnit(unitId as string);
        if (status) {
          scouts = scouts.filter(s => s.status === status);
        }
      } else if (status) {
        scouts = await storage.getScoutsByStatus(status as string);
      } else {
        scouts = await storage.getAllScouts();
      }

      res.json(scouts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/scouts/:id", async (req: Request, res: Response) => {
    try {
      const scout = await storage.getScout(req.params.id);
      if (!scout) {
        return res.status(404).json({ message: "Scout not found" });
      }
      res.json(scout);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/scouts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertScoutSchema.parse(req.body);
      const scout = await storage.createScout(validatedData);

      // Create audit log
      await storage.createAuditLog({
        userId: req.body.createdBy || null,
        action: "Created Scout",
        details: `Created new scout: ${scout.name} (${scout.uid})`,
        category: "create",
        ipAddress: req.ip,
      });

      res.status(201).json(scout);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/scouts/:id", async (req: Request, res: Response) => {
    try {
      const scout = await storage.updateScout(req.params.id, req.body);
      if (!scout) {
        return res.status(404).json({ message: "Scout not found" });
      }

      // Create audit log
      await storage.createAuditLog({
        userId: req.body.updatedBy || null,
        action: "Updated Scout",
        details: `Updated scout: ${scout.name} (${scout.uid})`,
        category: "update",
        ipAddress: req.ip,
      });

      res.json(scout);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/scouts/:id", async (req: Request, res: Response) => {
    try {
      const scout = await storage.getScout(req.params.id);
      if (!scout) {
        return res.status(404).json({ message: "Scout not found" });
      }

      const deleted = await storage.deleteScout(req.params.id);

      // Create audit log
      await storage.createAuditLog({
        userId: req.body.deletedBy || null,
        action: "Deleted Scout",
        details: `Deleted scout: ${scout.name} (${scout.uid})`,
        category: "delete",
        ipAddress: req.ip,
      });

      res.json({ success: deleted });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Schools Routes
  app.get("/api/schools", async (req: Request, res: Response) => {
    try {
      const schools = await storage.getAllSchools();
      res.json(schools);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/schools/:id", async (req: Request, res: Response) => {
    try {
      const school = await storage.getSchool(req.params.id);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/schools", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSchoolSchema.parse(req.body);
      const school = await storage.createSchool(validatedData);
      res.status(201).json(school);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/schools/:id", async (req: Request, res: Response) => {
    try {
      const school = await storage.updateSchool(req.params.id, req.body);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/schools/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteSchool(req.params.id);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Units Routes
  app.get("/api/units", async (req: Request, res: Response) => {
    try {
      const { schoolId, status } = req.query;
      let units;
      if (schoolId) {
        units = await storage.getUnitsBySchool(schoolId as string);
      } else if (status) {
        units = await storage.getUnitsByStatus(status as string);
      } else {
        units = await storage.getAllUnits();
      }
      res.json(units);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/units/:id", async (req: Request, res: Response) => {
    try {
      const unit = await storage.getUnit(req.params.id);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      res.json(unit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/units", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUnitSchema.parse(req.body);
      const unit = await storage.createUnit(validatedData);
      res.status(201).json(unit);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/units/:id", async (req: Request, res: Response) => {
    try {
      const unit = await storage.updateUnit(req.params.id, req.body);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      res.json(unit);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/units/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteUnit(req.params.id);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Activities Routes
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const activities = status
        ? await storage.getActivitiesByStatus(status as string)
        : await storage.getAllActivities();
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/activities/:id", async (req: Request, res: Response) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      // Using custom Zod schema that accepts string dates directly
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error: any) {
      console.error("Activity creation error:", error);
      if (error.errors) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  });

  app.put("/api/activities/:id", async (req: Request, res: Response) => {
    try {
      const activity = await storage.updateActivity(req.params.id, req.body);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/activities/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteActivity(req.params.id);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Announcements Routes
  app.get("/api/announcements", async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      const announcements = type
        ? await storage.getAnnouncementsByType(type as string)
        : await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/announcements/:id", async (req: Request, res: Response) => {
    try {
      const announcement = await storage.getAnnouncement(req.params.id);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/announcements", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/announcements/:id", async (req: Request, res: Response) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/announcements/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteAnnouncement(req.params.id);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reports Routes
  app.get("/api/reports", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const reports = category
        ? await storage.getReportsByCategory(category as string)
        : await storage.getAllReports();
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/:id", async (req: Request, res: Response) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/reports", async (req: Request, res: Response) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Activity Attendance Routes
  app.post("/api/activities/:activityId/attendance", async (req: Request, res: Response) => {
    try {
      const { activityId } = req.params;
      const { scoutId, attended } = req.body;

      const attendance = await storage.markAttendance({
        activityId,
        scoutId,
        attended: attended !== undefined ? attended : true,
      });

      res.status(201).json(attendance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/activities/:activityId/attendance", async (req: Request, res: Response) => {
    try {
      const { activityId } = req.params;
      const attendance = await storage.getActivityAttendance(activityId);
      res.json(attendance);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/scouts/:scoutId/attendance", async (req: Request, res: Response) => {
    try {
      const { scoutId } = req.params;
      const attendance = await storage.getScoutAttendance(scoutId);
      res.json(attendance);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Audit Logs Routes
  app.get("/api/audit", async (req: Request, res: Response) => {
    try {
      const { userId, category, limit } = req.query;
      let logs;
      if (userId) {
        logs = await storage.getAuditLogsByUser(userId as string);
      } else if (category) {
        logs = await storage.getAuditLogsByCategory(category as string);
      } else {
        logs = await storage.getAuditLogs(limit ? parseInt(limit as string) : undefined);
      }
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===== SETTINGS ROUTES =====

  // Get all settings
  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get settings by category
  app.get("/api/settings/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const settings = await storage.getSettingsByCategory(category);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update setting (admin only - requires role check)
  app.put("/api/settings/:key", async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const { value, updatedBy } = req.body;

      // TODO: Add role-based access control check here
      // For now, allow all updates

      const setting = await storage.updateSetting(key, value, updatedBy);

      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      await storage.createAuditLog({
        userId: updatedBy || null,
        action: "Updated Setting",
        details: `Updated ${key} to: ${value}`,
        category: "update",
        ipAddress: req.ip,
      });

      res.json(setting);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Initialize default settings (one-time setup)
  app.post("/api/settings/initialize", async (req: Request, res: Response) => {
    try {
      await storage.initializeDefaultSettings();
      res.json({ message: "Default settings initialized successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
