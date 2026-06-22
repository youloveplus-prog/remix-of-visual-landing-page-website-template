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
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          payload: Json | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          audience: string
          body: string | null
          created_at: string
          id: string
          level: string
          link: string | null
          title: string
        }
        Insert: {
          audience?: string
          body?: string | null
          created_at?: string
          id?: string
          level?: string
          link?: string | null
          title: string
        }
        Update: {
          audience?: string
          body?: string | null
          created_at?: string
          id?: string
          level?: string
          link?: string | null
          title?: string
        }
        Relationships: []
      }
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
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          slug?: string | null
        }
        Relationships: []
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
      content_assets: {
        Row: {
          content_item_id: string
          created_at: string
          display_order: number
          id: string
          is_preview: boolean
          kind: string
          storage_path: string
        }
        Insert: {
          content_item_id: string
          created_at?: string
          display_order?: number
          id?: string
          is_preview?: boolean
          kind: string
          storage_path: string
        }
        Update: {
          content_item_id?: string
          created_at?: string
          display_order?: number
          id?: string
          is_preview?: boolean
          kind?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_assets_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          category_id: string | null
          cover_url: string | null
          created_at: string
          creator_id: string | null
          currency: string
          description: string | null
          id: string
          kind: string
          price: number
          slug: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          creator_id?: string | null
          currency?: string
          description?: string | null
          id?: string
          kind?: string
          price?: number
          slug?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          creator_id?: string | null
          currency?: string
          description?: string | null
          id?: string
          kind?: string
          price?: number
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      content_purchases: {
        Row: {
          granted_at: string
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          granted_at?: string
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          created_at: string
          display_order: number
          duration_min: number
          id: string
          is_preview: boolean
          module_id: string
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          duration_min?: number
          id?: string
          is_preview?: boolean
          module_id: string
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          duration_min?: number
          id?: string
          is_preview?: boolean
          module_id?: string
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          content_item_id: string
          created_at: string
          display_order: number
          id: string
          title: string
        }
        Insert: {
          content_item_id: string
          created_at?: string
          display_order?: number
          id?: string
          title: string
        }
        Update: {
          content_item_id?: string
          created_at?: string
          display_order?: number
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_verified: boolean
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_verified?: boolean
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_verified?: boolean
          user_id?: string | null
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
      home_announcements: {
        Row: {
          body: string | null
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          is_pinned: boolean
          level: string
          link: string | null
          show_as_toast: boolean
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          level?: string
          link?: string | null
          show_as_toast?: boolean
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          level?: string
          link?: string | null
          show_as_toast?: boolean
          starts_at?: string | null
          title?: string
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
      learner_profiles: {
        Row: {
          active_track_id: string | null
          created_at: string
          goal: string | null
          interests: string[] | null
          last_active_at: string | null
          learning_style: string | null
          level: string | null
          locale: string
          longest_streak: number
          onboarded_at: string | null
          streak_days: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          active_track_id?: string | null
          created_at?: string
          goal?: string | null
          interests?: string[] | null
          last_active_at?: string | null
          learning_style?: string | null
          level?: string | null
          locale?: string
          longest_streak?: number
          onboarded_at?: string | null
          streak_days?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          active_track_id?: string | null
          created_at?: string
          goal?: string | null
          interests?: string[] | null
          last_active_at?: string | null
          learning_style?: string | null
          level?: string | null
          locale?: string
          longest_streak?: number
          onboarded_at?: string | null
          streak_days?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "learner_profiles_active_track_id_fkey"
            columns: ["active_track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_completions: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          lesson_id: string
          user_id: string
          xp_awarded: number
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id: string
          user_id: string
          xp_awarded?: number
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_completions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_md: string | null
          created_at: string
          duration_min: number
          id: string
          is_preview: boolean
          order: number
          outcome: string | null
          pdf_url: string | null
          title: string
          track_id: string
          transcript: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content_md?: string | null
          created_at?: string
          duration_min?: number
          id?: string
          is_preview?: boolean
          order?: number
          outcome?: string | null
          pdf_url?: string | null
          title: string
          track_id: string
          transcript?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content_md?: string | null
          created_at?: string
          duration_min?: number
          id?: string
          is_preview?: boolean
          order?: number
          outcome?: string | null
          pdf_url?: string | null
          title?: string
          track_id?: string
          transcript?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      live_activity_settings: {
        Row: {
          enrolments_enabled: boolean
          feed_window_hours: number
          id: string
          milestones_enabled: boolean
          purchases_enabled: boolean
          reviews_enabled: boolean
          toast_enabled: boolean
          toast_interval_seconds: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          enrolments_enabled?: boolean
          feed_window_hours?: number
          id?: string
          milestones_enabled?: boolean
          purchases_enabled?: boolean
          reviews_enabled?: boolean
          toast_enabled?: boolean
          toast_interval_seconds?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          enrolments_enabled?: boolean
          feed_window_hours?: number
          id?: string
          milestones_enabled?: boolean
          purchases_enabled?: boolean
          reviews_enabled?: boolean
          toast_enabled?: boolean
          toast_interval_seconds?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          host_id: string | null
          id: string
          scheduled_at: string
          status: string
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          host_id?: string | null
          id?: string
          scheduled_at: string
          status?: string
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          host_id?: string | null
          id?: string
          scheduled_at?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      mentor_bookings: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          mentor_name: string
          notes: string | null
          session_date: string
          session_slot: string
          status: string
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          mentor_name: string
          notes?: string | null
          session_date: string
          session_slot: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          mentor_name?: string
          notes?: string | null
          session_date?: string
          session_slot?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      milestones: {
        Row: {
          id: string
          kind: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          kind: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          kind?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          shipping_address: Json | null
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          shipping_address?: Json | null
          status?: string
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          shipping_address?: Json | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
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
      post_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          body: string | null
          comments: number
          created_at: string
          id: string
          is_pinned: boolean
          kind: string
          likes: number
          media_url: string | null
          product_id: string | null
          rating: number | null
          shares: number
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          user_id: string
          views: number
        }
        Insert: {
          body?: string | null
          comments?: number
          created_at?: string
          id?: string
          is_pinned?: boolean
          kind?: string
          likes?: number
          media_url?: string | null
          product_id?: string | null
          rating?: number | null
          shares?: number
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          views?: number
        }
        Update: {
          body?: string | null
          comments?: number
          created_at?: string
          id?: string
          is_pinned?: boolean
          kind?: string
          likes?: number
          media_url?: string | null
          product_id?: string | null
          rating?: number | null
          shares?: number
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      rewards: {
        Row: {
          cost: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          kind: string
          title: string
        }
        Insert: {
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          kind?: string
          title: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          kind?: string
          title?: string
        }
        Relationships: []
      }
      service_details: {
        Row: {
          content_item_id: string
          deliverables: Json
          revisions: number | null
          scope: string | null
          turnaround_days: number | null
          updated_at: string
        }
        Insert: {
          content_item_id: string
          deliverables?: Json
          revisions?: number | null
          scope?: string | null
          turnaround_days?: number | null
          updated_at?: string
        }
        Update: {
          content_item_id?: string
          deliverables?: Json
          revisions?: number | null
          scope?: string | null
          turnaround_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_details_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      today_missions: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          lesson_id: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          lesson_id?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          lesson_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "today_missions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
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
      tracks: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          created_at: string
          id: string
          kind: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
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
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      get_or_create_today_mission: {
        Args: never
        Returns: {
          completed: boolean
          created_at: string
          date: string
          id: string
          lesson_id: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "today_missions"
          isOneToOne: true
          isSetofReturn: false
        }
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
