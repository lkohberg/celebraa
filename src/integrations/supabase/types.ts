export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      event_analytics: {
        Row: {
          created_at: string
          event_id: string
          event_type: string
          id: string
          referrer: string | null
          user_agent: string | null
          visitor_ip: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          event_type: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          event_type?: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          event_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          event_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          event_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          ceremony_address: string | null
          ceremony_location: string | null
          children_welcome: boolean | null
          contact_email: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          created_at: string
          description: string | null
          dress_code: string | null
          event_date: string
          event_link: string
          event_time: string
          font: string | null
          hero_image_url: string | null
          hotel_recommendations: Json | null
          id: string
          languages: string[] | null
          location_name: string | null
          max_guests: number | null
          menu_selection: boolean | null
          price_paid: number | null
          primary_color: string | null
          reception_address: string | null
          reception_location: string | null
          rsvp_deadline: string | null
          rsvp_enabled: boolean | null
          schedule: Json | null
          selected_blocks: string[] | null
          status: string
          story_text: string | null
          stripe_payment_id: string | null
          template_id: string
          tier: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          ceremony_address?: string | null
          ceremony_location?: string | null
          children_welcome?: boolean | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          description?: string | null
          dress_code?: string | null
          event_date: string
          event_link: string
          event_time: string
          font?: string | null
          hero_image_url?: string | null
          hotel_recommendations?: Json | null
          id?: string
          languages?: string[] | null
          location_name?: string | null
          max_guests?: number | null
          menu_selection?: boolean | null
          price_paid?: number | null
          primary_color?: string | null
          reception_address?: string | null
          reception_location?: string | null
          rsvp_deadline?: string | null
          rsvp_enabled?: boolean | null
          schedule?: Json | null
          selected_blocks?: string[] | null
          status?: string
          story_text?: string | null
          stripe_payment_id?: string | null
          template_id: string
          tier?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          ceremony_address?: string | null
          ceremony_location?: string | null
          children_welcome?: boolean | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          description?: string | null
          dress_code?: string | null
          event_date?: string
          event_link?: string
          event_time?: string
          font?: string | null
          hero_image_url?: string | null
          hotel_recommendations?: Json | null
          id?: string
          languages?: string[] | null
          location_name?: string | null
          max_guests?: number | null
          menu_selection?: boolean | null
          price_paid?: number | null
          primary_color?: string | null
          reception_address?: string | null
          reception_location?: string | null
          rsvp_deadline?: string | null
          rsvp_enabled?: boolean | null
          schedule?: Json | null
          selected_blocks?: string[] | null
          status?: string
          story_text?: string | null
          stripe_payment_id?: string | null
          template_id?: string
          tier?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          email: string | null
          event_id: string
          id: string
          menu_choice: string | null
          message: string | null
          name: string
          plus_one: boolean | null
          responded_at: string | null
          rsvp_status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          menu_choice?: string | null
          message?: string | null
          name: string
          plus_one?: boolean | null
          responded_at?: string | null
          rsvp_status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          menu_choice?: string | null
          message?: string | null
          name?: string
          plus_one?: boolean | null
          responded_at?: string | null
          rsvp_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
