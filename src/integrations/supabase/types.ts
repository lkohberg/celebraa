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
      copyright_reports: {
        Row: {
          created_at: string
          event_id: string
          id: string
          reason: string | null
          reporter_email: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          reason?: string | null
          reporter_email?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          reason?: string | null
          reporter_email?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "copyright_reports_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "copyright_reports_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
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
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
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
          {
            foreignKeyName: "event_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          block_config: Json | null
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
          block_config?: Json | null
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
          block_config?: Json | null
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
      game_votes: {
        Row: {
          created_at: string
          event_id: string
          game_name: string
          guest_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          game_name: string
          guest_name?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          game_name?: string
          guest_name?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_photos: {
        Row: {
          created_at: string
          event_id: string
          guest_name: string | null
          id: string
          photo_url: string
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_name?: string | null
          id?: string
          photo_url: string
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_name?: string | null
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          companion_count: number | null
          companion_names: string[] | null
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
          companion_count?: number | null
          companion_names?: string[] | null
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
          companion_count?: number | null
          companion_names?: string[] | null
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
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      music_wishes: {
        Row: {
          artist: string | null
          created_at: string
          event_id: string
          guest_name: string | null
          id: string
          song_title: string
        }
        Insert: {
          artist?: string | null
          created_at?: string
          event_id: string
          guest_name?: string | null
          id?: string
          song_title: string
        }
        Update: {
          artist?: string | null
          created_at?: string
          event_id?: string
          guest_name?: string | null
          id?: string
          song_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_wishes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_wishes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      potluck_claims: {
        Row: {
          claimed_by: string
          created_at: string
          event_id: string
          id: string
          item_name: string
        }
        Insert: {
          claimed_by: string
          created_at?: string
          event_id: string
          id?: string
          item_name: string
        }
        Update: {
          claimed_by?: string
          created_at?: string
          event_id?: string
          id?: string
          item_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "potluck_claims_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potluck_claims_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string
          current_uses: number
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_uses: number | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by: string
          current_uses?: number
          discount_type?: string
          discount_value: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          created_at: string
          event_id: string
          guest_name: string | null
          id: string
          question_index: number
          selected_option: number
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_name?: string | null
          id?: string
          question_index: number
          selected_option: number
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_name?: string | null
          id?: string
          question_index?: number
          selected_option?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      events_public: {
        Row: {
          address: string | null
          block_config: Json | null
          ceremony_address: string | null
          ceremony_location: string | null
          children_welcome: boolean | null
          description: string | null
          dress_code: string | null
          event_date: string | null
          event_link: string | null
          event_time: string | null
          font: string | null
          hero_image_url: string | null
          hotel_recommendations: Json | null
          id: string | null
          languages: string[] | null
          location_name: string | null
          max_guests: number | null
          menu_selection: boolean | null
          primary_color: string | null
          reception_address: string | null
          reception_location: string | null
          rsvp_deadline: string | null
          rsvp_enabled: boolean | null
          schedule: Json | null
          selected_blocks: string[] | null
          status: string | null
          story_text: string | null
          template_id: string | null
          tier: string | null
          title: string | null
        }
        Insert: {
          address?: string | null
          block_config?: Json | null
          ceremony_address?: string | null
          ceremony_location?: string | null
          children_welcome?: boolean | null
          description?: string | null
          dress_code?: string | null
          event_date?: string | null
          event_link?: string | null
          event_time?: string | null
          font?: string | null
          hero_image_url?: string | null
          hotel_recommendations?: Json | null
          id?: string | null
          languages?: string[] | null
          location_name?: string | null
          max_guests?: number | null
          menu_selection?: boolean | null
          primary_color?: string | null
          reception_address?: string | null
          reception_location?: string | null
          rsvp_deadline?: string | null
          rsvp_enabled?: boolean | null
          schedule?: Json | null
          selected_blocks?: string[] | null
          status?: string | null
          story_text?: string | null
          template_id?: string | null
          tier?: string | null
          title?: string | null
        }
        Update: {
          address?: string | null
          block_config?: Json | null
          ceremony_address?: string | null
          ceremony_location?: string | null
          children_welcome?: boolean | null
          description?: string | null
          dress_code?: string | null
          event_date?: string | null
          event_link?: string | null
          event_time?: string | null
          font?: string | null
          hero_image_url?: string | null
          hotel_recommendations?: Json | null
          id?: string | null
          languages?: string[] | null
          location_name?: string | null
          max_guests?: number | null
          menu_selection?: boolean | null
          primary_color?: string | null
          reception_address?: string | null
          reception_location?: string | null
          rsvp_deadline?: string | null
          rsvp_enabled?: boolean | null
          schedule?: Json | null
          selected_blocks?: string[] | null
          status?: string | null
          story_text?: string | null
          template_id?: string | null
          tier?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_user_email: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_event_live: { Args: { _event_id: string }; Returns: boolean }
      is_event_rsvp_open: { Args: { _event_id: string }; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
