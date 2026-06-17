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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          attempt_payload: Json | null
          created_at: string
          hint_level: number | null
          id: string
          parts: Json
          role: string
          socratic_step: string | null
          thread_id: string
          topic_hint: string | null
          topic_id: string | null
          user_id: string
        }
        Insert: {
          attempt_payload?: Json | null
          created_at?: string
          hint_level?: number | null
          id?: string
          parts?: Json
          role: string
          socratic_step?: string | null
          thread_id: string
          topic_hint?: string | null
          topic_id?: string | null
          user_id: string
        }
        Update: {
          attempt_payload?: Json | null
          created_at?: string
          hint_level?: number | null
          id?: string
          parts?: Json
          role?: string
          socratic_step?: string | null
          thread_id?: string
          topic_hint?: string | null
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "ai_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_threads: {
        Row: {
          active_step: string | null
          active_topic_id: string | null
          created_at: string
          id: string
          last_hint_level: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active_step?: string | null
          active_topic_id?: string | null
          created_at?: string
          id?: string
          last_hint_level?: number | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active_step?: string | null
          active_topic_id?: string | null
          created_at?: string
          id?: string
          last_hint_level?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_threads_active_topic_id_fkey"
            columns: ["active_topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          avatar_url: string | null
          comments: number
          content: string
          created_at: string
          display_name: string
          id: string
          images: string[]
          likes: number
          product_id: string | null
          shares: number
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          comments?: number
          content: string
          created_at?: string
          display_name: string
          id?: string
          images?: string[]
          likes?: number
          product_id?: string | null
          shares?: number
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          comments?: number
          content?: string
          created_at?: string
          display_name?: string
          id?: string
          images?: string[]
          likes?: number
          product_id?: string | null
          shares?: number
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      curriculum_topics: {
        Row: {
          chapter: string | null
          class_level: string | null
          created_at: string
          display_name: string
          id: string
          skill: string | null
          slug: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          chapter?: string | null
          class_level?: string | null
          created_at?: string
          display_name: string
          id?: string
          skill?: string | null
          slug: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          chapter?: string | null
          class_level?: string | null
          created_at?: string
          display_name?: string
          id?: string
          skill?: string | null
          slug?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      learner_mastery: {
        Row: {
          attempts: number
          correct_count: number
          created_at: string
          hint_count: number
          id: string
          last_practiced_at: string
          mastery_score: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          correct_count?: number
          created_at?: string
          hint_count?: number
          id?: string
          last_practiced_at?: string
          mastery_score?: number
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          correct_count?: number
          created_at?: string
          hint_count?: number
          id?: string
          last_practiced_at?: string
          mastery_score?: number
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_mastery_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_session_notes: {
        Row: {
          created_at: string
          duration_minutes: number | null
          growth_areas: string | null
          homework: string | null
          id: string
          mentor_id: string | null
          mentor_user_id: string
          session_date: string
          strengths: string | null
          student_name: string
          student_user_id: string | null
          topics_covered: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          growth_areas?: string | null
          homework?: string | null
          id?: string
          mentor_id?: string | null
          mentor_user_id: string
          session_date?: string
          strengths?: string | null
          student_name: string
          student_user_id?: string | null
          topics_covered?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          growth_areas?: string | null
          homework?: string | null
          id?: string
          mentor_id?: string | null
          mentor_user_id?: string
          session_date?: string
          strengths?: string | null
          student_name?: string
          student_user_id?: string | null
          topics_covered?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      mentor_verifications: {
        Row: {
          background_check: boolean
          created_at: string
          id: string
          id_check: boolean
          mentor_id: string
          notes: string | null
          qualification_check: boolean
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          background_check?: boolean
          created_at?: string
          id?: string
          id_check?: boolean
          mentor_id: string
          notes?: string | null
          qualification_check?: boolean
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          background_check?: boolean
          created_at?: string
          id?: string
          id_check?: boolean
          mentor_id?: string
          notes?: string | null
          qualification_check?: boolean
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      parent_links: {
        Row: {
          created_at: string
          id: string
          parent_user_id: string
          relationship: string
          status: string
          student_user_id: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          parent_user_id: string
          relationship?: string
          status?: string
          student_user_id: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          parent_user_id?: string
          relationship?: string
          status?: string
          student_user_id?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      product_clicks: {
        Row: {
          clicked_at: string
          id: string
          price: number | null
          product_id: string
          product_name: string
          product_slug: string
        }
        Insert: {
          clicked_at?: string
          id?: string
          price?: number | null
          product_id: string
          product_name: string
          product_slug: string
        }
        Update: {
          clicked_at?: string
          id?: string
          price?: number | null
          product_id?: string
          product_name?: string
          product_slug?: string
        }
        Relationships: []
      }
      product_impressions: {
        Row: {
          dwell_ms: number
          id: string
          max_visibility: number
          observed_at: string
          price: number | null
          product_id: string
          product_name: string
          product_slug: string
          viewport_h: number | null
          viewport_w: number | null
        }
        Insert: {
          dwell_ms?: number
          id?: string
          max_visibility?: number
          observed_at?: string
          price?: number | null
          product_id: string
          product_name: string
          product_slug: string
          viewport_h?: number | null
          viewport_w?: number | null
        }
        Update: {
          dwell_ms?: number
          id?: string
          max_visibility?: number
          observed_at?: string
          price?: number | null
          product_id?: string
          product_name?: string
          product_slug?: string
          viewport_h?: number | null
          viewport_w?: number | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          content: string
          created_at: string
          helpful_count: number
          id: string
          images: string[]
          is_verified_purchase: boolean
          product_id: string
          rating: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[]
          is_verified_purchase?: boolean
          product_id: string
          rating: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[]
          is_verified_purchase?: boolean
          product_id?: string
          rating?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_profile_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_authentic: boolean
          is_featured: boolean
          is_trending: boolean
          kind: string
          name: string
          original_price: number | null
          price: number
          rating: number | null
          review_count: number
          slug: string
          stock: number
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_authentic?: boolean
          is_featured?: boolean
          is_trending?: boolean
          kind?: string
          name: string
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number
          slug: string
          stock?: number
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_authentic?: boolean
          is_featured?: boolean
          is_trending?: boolean
          kind?: string
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number
          slug?: string
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
          username?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      topic_prerequisites: {
        Row: {
          created_at: string
          id: string
          prerequisite_topic_id: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prerequisite_topic_id: string
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prerequisite_topic_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_prerequisites_prerequisite_topic_id_fkey"
            columns: ["prerequisite_topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_prerequisites_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_recommended_topic: {
        Args: never
        Returns: {
          chapter: string
          display_name: string
          mastery_score: number
          reason: string
          slug: string
          subject: string
          topic_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_post_engagement: {
        Args: { _field: string; _post_id: string }
        Returns: undefined
      }
      is_verified_parent_of: {
        Args: { _student_user_id: string }
        Returns: boolean
      }
      record_mastery_attempt: {
        Args: { _hint_level?: number; _outcome: number; _topic_id: string }
        Returns: {
          attempts: number
          correct_count: number
          created_at: string
          hint_count: number
          id: string
          last_practiced_at: string
          mastery_score: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "learner_mastery"
          isOneToOne: true
          isSetofReturn: false
        }
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
