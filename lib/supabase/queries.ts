import { Database } from "@/types/types_db_admin";
import { createClient } from "./admin_client";
type User = Database["public"]["Tables"]["users"]["Row"];
type UserIsAdmin = Pick<User, "is_admin_can_upload">;
export const getAdminUsers = async (
  email: string,
  isAdmin: boolean
): Promise<UserIsAdmin | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, is_admin_can_upload, email")
    .eq("email", email)
    .eq("is_admin_can_upload", isAdmin)
    .single();

  if (error) {
    console.error("Error fetching users:", error);
    return null;
  }

  return data;

  //   return data.filter((user) => user.is_admin_can_upload === true);
};
