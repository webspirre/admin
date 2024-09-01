import { createBrowserClient } from "@supabase/ssr";
import { DesignDatabase } from "@/types/types_db";

// Define a function to create a Supabase client for client-side operations
export const createClient = () =>
  createBrowserClient<DesignDatabase>(
    // Pass Supabase URL and anonymous key from the environment to the client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: "webspirre_admin", // Specify the schema for admin operations
      },
    }
  );
export const supabase = createClient();
