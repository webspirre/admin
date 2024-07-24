import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/types_db_admin";

// Define a function to create a Supabase client for server-side operations
export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value;
          console.log(`Getting cookie ${name}: ${value}`);
          return value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            console.log(`Setting cookie ${name}: ${value}`, options);
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(`Error setting cookie ${name}`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            console.log(`Removing cookie ${name}`, options);
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            console.error(`Error removing cookie ${name}`, error);
          }
        },
      },
    }
  );
};
