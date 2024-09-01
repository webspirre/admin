import { Database } from "@/types/types_db_admin";
import { createClient } from "./admin_client";
type User = Database["public"]["Tables"]["users"]["Row"];
type UserIsAdmin = Pick<User, "is_admin">;

export const getAdminUsers = async (
  email: string
): Promise<UserIsAdmin | null | boolean | { error?: string }> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .schema("public")
    .from("users")
    .select("is_admin")
    .eq("email", email)
    .eq("is_admin", true)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Error fetching users:", error);
    return { error: error.message };
  }

  if (!data) {
    console.warn("No users found with the given email.");
    return null;
  }

  return data.is_admin; // Return the is_admin value directly
};
