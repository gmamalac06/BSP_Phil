import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  email: string;
  username: string;
  role: "admin" | "staff" | "unit_leader" | "scout" | "user";
  isApproved: boolean;
  schoolId?: string;
  unitId?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async (sessionUser: SupabaseUser) => {
      try {
        // Query user directly from Supabase
        const { data: dbUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", sessionUser.id)
          .single();

        if (!error && dbUser && mounted) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email || "",
            username: dbUser.username || sessionUser.user_metadata?.username || sessionUser.email?.split("@")[0] || "User",
            role: dbUser.role as AppUser["role"],
            isApproved: dbUser.is_approved ?? false,
            schoolId: dbUser.school_id,
            unitId: dbUser.unit_id,
          });
        } else {
          console.error("Failed to fetch user profile:", error?.message);
          if (mounted) {
            setUser(transformUser(sessionUser));
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (mounted) {
          setUser(transformUser(sessionUser));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Only fetch if we don't have the user or it's a different user
        // But for safety on login, let's fetch.
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const transformUser = (supabaseUser: SupabaseUser): AppUser => {
    // Get role from user metadata or default to 'user'
    const role = (supabaseUser.user_metadata?.role ||
      supabaseUser.app_metadata?.role ||
      "user") as AppUser["role"];

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      username: supabaseUser.user_metadata?.username || supabaseUser.email?.split("@")[0] || "User",
      role,
      isApproved: false, // Default to false if we can't fetch DB
    };
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || isAdmin;
  const isUnitLeader = user?.role === "unit_leader" || isAdmin;
  const isUser = !!user;

  return {
    user,
    isAuthenticated: !!user,
    isAdmin,
    isStaff,
    isUnitLeader,
    isUser,
    loading,
  };
}

export function useRequireRole(requiredRole: AppUser["role"]) {
  const { user, loading } = useAuth();

  if (loading) return true; // Allow access while loading

  if (!user) return false;

  const roleHierarchy: Record<string, number> = {
    admin: 4,
    staff: 3,
    unit_leader: 2,
    scout: 1,
    user: 0
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

export async function signOut() {
  await supabase.auth.signOut();
}
