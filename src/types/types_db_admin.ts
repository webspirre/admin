export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
interface Option {
  value: string;
  label: string;
}
export type Map = string | string[] | null | Option | Option[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          id: string;
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null;
          interval_count: number | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          id: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          id?: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey";
            columns: ["price_id"];
            isOneToOne: false;
            referencedRelation: "prices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      usersdel: {
        Row: {
          avatar_url: string | null;
          billing_address: Json | null;
          full_name: string | null;
          id: string;
          payment_method: Json | null;
          profile_image_url: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
          profile_image_url?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
          profile_image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      corebicle_transaction: {
        Row: {
          payeeName: string | null;
          amountPaid: string | null;
          staffPaidTo: string | null;
          paymentMethod: string | null;
          paymentId: string | null;
          plan: string | null;
          date: string | null;
        };
        Insert: {
          payeeName?: string | null;
          amountPaid?: string | null;
          staffPaidTo?: string | null;
          paymentMethod?: string | null;
          paymentId?: string | null;
          plan?: string | null;
          date?: string | null;
        };
        Update: {
          payeeName?: string | null;
          amountPaid?: string | null;
          staffPaidTo?: string | null;
          paymentMethod?: string | null;
          paymentId?: string | null;
          plan?: string | null;
          date?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Delete: {
          id: string;
        };
      };
      cta: {
        Row: {
          subject: Map | null;
          department: Map | null;
          enquiry: Map | null;
          email: Map | null;
        };
        Insert: {
          subject?: Map | null;
          department?: Map | null;
          enquiry?: Map | null;
          email?: Map | null;
        };
        Update: {
          subject?: Map | null;
          department?: Map | null;
          enquiry?: Map | null;
          email?: Map | null;
        };
        Delete: {
          id: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string | null;
          uid: string | null;
          title: string | null;
          description: string | null;
          timestamp: string | null;
          isRead: boolean | null;
        };
        Insert: {
          id?: string | null;
          uid?: string | null;
          title?: string | null;
          description?: string | null;
          timestamp?: string | null;
          isRead?: boolean | null;
        };
        Update: {
          id?: string | null;
          uid?: string | null;
          title?: string | null;
          description?: string | null;
          timestamp?: string | null;
          isRead?: boolean | null;
        };
        Delete: {
          id: string;
        };
        Relationships: [];
      };
      website: {
        Row: {
          name: string | null;
          webURL: string | null;
          pageType: string | null;
          shortDescription: string | null;
          longDescription: string | null;
          logoImageURL: string | null;
          desktopSsURL: string | null;
          mobileSsURL: string | null;
          desktopFpURL: string | null;
          mobileFpURL: string | null;
          categories: string[] | null;
          date: string | null;
          views: string | null;
          uid: string | null;
        };
        Insert: {
          name?: string | null;
          webURL?: string | null;
          pageType?: string | null;
          shortDescription?: string | null;
          longDescription?: string | null;
          logoImageURL?: string | null;
          desktopSsURL?: string | null;
          mobileSsURL?: string | null;
          desktopFpURL?: string | null;
          mobileFpURL?: string | null;
          categories?: string[] | null;
          date?: string | null;
          view?: string | null;
          uid?: string | null;
        };
        Update: {
          name?: string | null;
          webURL?: string | null;
          pageType?: string | null;
          shortDescription?: string | null;
          longDescription?: string | null;
          logoImageURL?: string | null;
          desktopSsURL?: string | null;
          mobileSsURL?: string | null;
          desktopFpURL?: string | null;
          mobileFpURL?: string | null;
          categories?: string[] | null;
          date?: string | null;
          view?: string | null;
          uid?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          updated_at: string | null;
          // username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          is_admin_can_upload: boolean | null;
          email: string | null;
          role: string | null;
          is_admin: boolean | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          // username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          is_admin_can_upload?: boolean | null;
          is_admin?: boolean | null;
          email?: string | null;
          role?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          // username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          is_admin_can_upload?: boolean | null;
          email?: string | null;
          role?: string | null;
          is_admin?: boolean | null;
        };
        Delete: {
          id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year";
      pricing_type: "one_time" | "recurring";
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  webspirre_admin: {
    Tables: {
      website: {
        Row: {
          name: string | null;
          webURL: string | null;
          pageType: string | null;
          shortDescription: string | null;
          longDescription: string | null;
          logoImageURL: string | null;
          desktopSsURL: string | null;
          mobileSsURL: string | null;
          desktopFpURL: string | null;
          mobileFpURL: string | null;
          categories: string[] | null;
          date: string | null;
          views: string | null;
          uid: string | null;
        };
        Insert: {
          name?: string | null;
          webURL?: string | null;
          pageType?: string | null;
          shortDescription?: string | null;
          longDescription?: string | null;
          logoImageURL?: string | null;
          desktopSsURL?: string | null;
          mobileSsURL?: string | null;
          desktopFpURL?: string | null;
          mobileFpURL?: string | null;
          categories?: string[] | null;
          date?: string | null;
          view?: string | null;
          uid?: string | null;
        };
        Update: {
          name?: string | null;
          webURL?: string | null;
          pageType?: string | null;
          shortDescription?: string | null;
          longDescription?: string | null;
          logoImageURL?: string | null;
          desktopSsURL?: string | null;
          mobileSsURL?: string | null;
          desktopFpURL?: string | null;
          mobileFpURL?: string | null;
          categories?: string[] | null;
          date?: string | null;
          view?: string | null;
          uid?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year";
      pricing_type: "one_time" | "recurring";
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] &
        Database["public"]["Views"] &
        Database["webspirre_admin"]["Tables"] &
        Database["webspirre_admin"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"] &
      Database["webspirre_admin"]["Tables"] &
      Database["webspirre_admin"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"] &
      Database["webspirre_admin"]["Tables"] &
      Database["webspirre_admin"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | keyof Database["webspirre_admin"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"] & Database["webspirre_admin"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"] &
      Database["webspirre_admin"]["Enums"])
  ? (Database["public"]["Enums"] &
      Database["webspirre_admin"]["Enums"])[PublicEnumNameOrOptions]
  : never;
