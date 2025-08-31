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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_model_costs: {
        Row: {
          audio_cost_per_minute: number | null
          created_at: string
          id: string
          input_cost_per_token: number | null
          model_name: string
          output_cost_per_token: number | null
          updated_at: string
        }
        Insert: {
          audio_cost_per_minute?: number | null
          created_at?: string
          id?: string
          input_cost_per_token?: number | null
          model_name: string
          output_cost_per_token?: number | null
          updated_at?: string
        }
        Update: {
          audio_cost_per_minute?: number | null
          created_at?: string
          id?: string
          input_cost_per_token?: number | null
          model_name?: string
          output_cost_per_token?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          audio_duration_seconds: number | null
          created_at: string
          estimated_cost: number | null
          id: string
          model_used: string | null
          request_type: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          audio_duration_seconds?: number | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          model_used?: string | null
          request_type: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          audio_duration_seconds?: number | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          model_used?: string | null
          request_type?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      app_motivators: {
        Row: {
          caption: string | null
          category: string
          completed_sessions: number | null
          created_at: string
          description: string
          difficulty: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_predefined: boolean | null
          sort_order: number | null
          subcategory: string | null
          tags: string[] | null
          timeframe: string | null
          times_used: number | null
          title: string
          total_sessions: number | null
          total_time_spent: number | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          category?: string
          completed_sessions?: number | null
          created_at?: string
          description: string
          difficulty?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_predefined?: boolean | null
          sort_order?: number | null
          subcategory?: string | null
          tags?: string[] | null
          timeframe?: string | null
          times_used?: number | null
          title: string
          total_sessions?: number | null
          total_time_spent?: number | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          category?: string
          completed_sessions?: number | null
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_predefined?: boolean | null
          sort_order?: number | null
          subcategory?: string | null
          tags?: string[] | null
          timeframe?: string | null
          times_used?: number | null
          title?: string
          total_sessions?: number | null
          total_time_spent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      background_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          categories: string[] | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          published_at: string | null
          show_author_box: boolean
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          categories?: string[] | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          show_author_box?: boolean
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          categories?: string[] | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          show_author_box?: boolean
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          archived: boolean
          conversation_type: string | null
          created_at: string
          id: string
          last_message_at: string
          messages: Json
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          conversation_type?: string | null
          created_at?: string
          id?: string
          last_message_at?: string
          messages?: Json
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          conversation_type?: string | null
          created_at?: string
          id?: string
          last_message_at?: string
          messages?: Json
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      connection_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_summaries: {
        Row: {
          created_at: string | null
          date_range_end: string
          date_range_start: string
          id: string
          relevance_score: number | null
          summary_data: Json
          summary_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_range_end: string
          date_range_start: string
          id?: string
          relevance_score?: number | null
          summary_data: Json
          summary_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_range_end?: string
          date_range_start?: string
          id?: string
          relevance_score?: number | null
          summary_data?: Json
          summary_type?: string
          user_id?: string
        }
        Relationships: []
      }
      coupon_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          duration_days: number
          expires_at: string | null
          id: string
          is_active: boolean
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      daily_activity_overrides: {
        Row: {
          activity_level: string
          created_at: string
          date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_food_templates: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          id: string
          image_url: string | null
          name: string
          serving_size: number
          sort_order: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          serving_size?: number
          sort_order?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          serving_size?: number
          sort_order?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      default_food_favorites: {
        Row: {
          created_at: string
          default_food_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_food_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_food_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "default_food_favorites_default_food_id_fkey"
            columns: ["default_food_id"]
            isOneToOne: false
            referencedRelation: "default_foods"
            referencedColumns: ["id"]
          },
        ]
      }
      default_foods: {
        Row: {
          calories_per_100g: number
          carbs_per_100g: number
          created_at: string
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          calories_per_100g: number
          carbs_per_100g: number
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          calories_per_100g?: number
          carbs_per_100g?: number
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          image_alignment: string | null
          image_url: string | null
          is_active: boolean
          page_category: string | null
          question: string
          show_open_by_default: boolean | null
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          image_alignment?: string | null
          image_url?: string | null
          is_active?: boolean
          page_category?: string | null
          question: string
          show_open_by_default?: boolean | null
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          image_alignment?: string | null
          image_url?: string | null
          is_active?: boolean
          page_category?: string | null
          question?: string
          show_open_by_default?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      fasting_hours: {
        Row: {
          admin_personal_log: string | null
          autophagy_milestone: boolean | null
          benefits_challenges: string | null
          body_state: string
          challenging_symptoms: string[] | null
          common_feelings: string[] | null
          content_rotation_data: Json | null
          content_snippet: string | null
          created_at: string
          day: number
          difficulty: string
          encouragement: string | null
          fat_burning_milestone: boolean | null
          hour: number
          id: string
          image_url: string | null
          ketosis_milestone: boolean | null
          mental_emotional_state: string[] | null
          metabolic_changes: string | null
          motivator_tags: string[] | null
          phase: string
          physiological_effects: string | null
          positive_symptoms: string[] | null
          read_more_url: string | null
          scientific_info: string | null
          stage: string | null
          tips: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_personal_log?: string | null
          autophagy_milestone?: boolean | null
          benefits_challenges?: string | null
          body_state: string
          challenging_symptoms?: string[] | null
          common_feelings?: string[] | null
          content_rotation_data?: Json | null
          content_snippet?: string | null
          created_at?: string
          day: number
          difficulty?: string
          encouragement?: string | null
          fat_burning_milestone?: boolean | null
          hour: number
          id?: string
          image_url?: string | null
          ketosis_milestone?: boolean | null
          mental_emotional_state?: string[] | null
          metabolic_changes?: string | null
          motivator_tags?: string[] | null
          phase?: string
          physiological_effects?: string | null
          positive_symptoms?: string[] | null
          read_more_url?: string | null
          scientific_info?: string | null
          stage?: string | null
          tips?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_personal_log?: string | null
          autophagy_milestone?: boolean | null
          benefits_challenges?: string | null
          body_state?: string
          challenging_symptoms?: string[] | null
          common_feelings?: string[] | null
          content_rotation_data?: Json | null
          content_snippet?: string | null
          created_at?: string
          day?: number
          difficulty?: string
          encouragement?: string | null
          fat_burning_milestone?: boolean | null
          hour?: number
          id?: string
          image_url?: string | null
          ketosis_milestone?: boolean | null
          mental_emotional_state?: string[] | null
          metabolic_changes?: string | null
          motivator_tags?: string[] | null
          phase?: string
          physiological_effects?: string | null
          positive_symptoms?: string[] | null
          read_more_url?: string | null
          scientific_info?: string | null
          stage?: string | null
          tips?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fasting_sessions: {
        Row: {
          created_at: string
          duration_seconds: number | null
          end_time: string | null
          goal_duration_seconds: number | null
          id: string
          start_time: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          goal_duration_seconds?: number | null
          id?: string
          start_time: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          goal_duration_seconds?: number | null
          id?: string
          start_time?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fasting_timeline_posts: {
        Row: {
          author: string
          categories: string[] | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          hour: number
          how_youre_feeling: string | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          whats_happening: string | null
        }
        Insert: {
          author?: string
          categories?: string[] | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          hour: number
          how_youre_feeling?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          whats_happening?: string | null
        }
        Update: {
          author?: string
          categories?: string[] | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          hour?: number
          how_youre_feeling?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          whats_happening?: string | null
        }
        Relationships: []
      }
      feature_screenshots: {
        Row: {
          created_at: string
          feature_key: string
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_key: string
          id?: string
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_key?: string
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_entries: {
        Row: {
          calories: number
          carbs: number
          consumed: boolean
          created_at: string
          id: string
          image_url: string | null
          name: string
          serving_size: number | null
          source_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories: number
          carbs: number
          consumed?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          serving_size?: number | null
          source_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          consumed?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          serving_size?: number | null
          source_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      general_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      home_steps: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon_name: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      manual_calorie_burns: {
        Row: {
          activity_name: string
          calories_burned: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_name: string
          calories_burned: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_name?: string
          calories_burned?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivator_image_generations: {
        Row: {
          bucket: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          filename: string
          id: string
          image_url: string | null
          motivator_id: string
          prompt: string
          requested_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bucket?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          filename: string
          id?: string
          image_url?: string | null
          motivator_id: string
          prompt: string
          requested_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bucket?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          filename?: string
          id?: string
          image_url?: string | null
          motivator_id?: string
          prompt?: string
          requested_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivators: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          link_url: string | null
          show_in_animations: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          show_in_animations?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          show_in_animations?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      navigation_settings: {
        Row: {
          created_at: string
          custom_url: string | null
          display_order: number
          id: string
          is_visible: boolean
          page_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_url?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean
          page_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_url?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean
          page_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          button_text: string | null
          button_url: string | null
          content: string | null
          created_at: string
          featured_image_url: string | null
          id: string
          is_indexed: boolean | null
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          page_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_indexed?: boolean | null
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          content?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_indexed?: boolean | null
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_seo_settings: {
        Row: {
          created_at: string
          id: string
          is_dynamic: boolean
          is_indexed: boolean
          meta_description: string | null
          meta_title: string | null
          page_description: string | null
          page_path: string
          page_title: string
          page_type: string
          robots_directive: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_dynamic?: boolean
          is_indexed?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_description?: string | null
          page_path: string
          page_title: string
          page_type?: string
          robots_directive?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_dynamic?: boolean
          is_indexed?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_description?: string | null
          page_path?: string
          page_title?: string
          page_type?: string
          robots_directive?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_provider_configs: {
        Row: {
          config_data: Json
          created_at: string
          id: string
          is_active: boolean
          provider: string
          updated_at: string
        }
        Insert: {
          config_data?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          provider: string
          updated_at?: string
        }
        Update: {
          config_data?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_receipts: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          provider: string
          receipt_data: Json
          subscription_id: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string
          validation_response: Json | null
          validation_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          provider: string
          receipt_data: Json
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
          validation_response?: Json | null
          validation_status?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          provider?: string
          receipt_data?: Json
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
          validation_response?: Json | null
          validation_status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"] | null
          activity_level: string | null
          age: number | null
          ai_requests_reset_date: string | null
          apple_transaction_id: string | null
          created_at: string
          daily_calorie_goal: number | null
          daily_carb_goal: number | null
          default_walking_speed: number | null
          deletion_reason: string | null
          deletion_scheduled_at: string | null
          display_name: string | null
          enable_ceramic_animations: boolean | null
          enable_daily_reset: boolean | null
          enable_fasting_slideshow: boolean | null
          enable_food_image_generation: boolean | null
          enable_walking_slideshow: boolean | null
          goal_weight: number | null
          google_play_purchase_token: string | null
          height: number | null
          id: string
          is_paid_user: boolean | null
          last_activity_at: string | null
          manual_tdee_override: number | null
          monthly_ai_requests: number | null
          onboarding_completed: boolean | null
          payment_method: string | null
          payment_provider: string | null
          platform_subscription_id: string | null
          premium_expires_at: string | null
          sex: string | null
          speech_model: string | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_product_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          transcription_model: string | null
          trial_ends_at: string | null
          trial_started_at: string | null
          tts_model: string | null
          tts_voice: string | null
          units: string | null
          updated_at: string
          user_id: string
          user_tier: Database["public"]["Enums"]["user_tier"] | null
          weight: number | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          activity_level?: string | null
          age?: number | null
          ai_requests_reset_date?: string | null
          apple_transaction_id?: string | null
          created_at?: string
          daily_calorie_goal?: number | null
          daily_carb_goal?: number | null
          default_walking_speed?: number | null
          deletion_reason?: string | null
          deletion_scheduled_at?: string | null
          display_name?: string | null
          enable_ceramic_animations?: boolean | null
          enable_daily_reset?: boolean | null
          enable_fasting_slideshow?: boolean | null
          enable_food_image_generation?: boolean | null
          enable_walking_slideshow?: boolean | null
          goal_weight?: number | null
          google_play_purchase_token?: string | null
          height?: number | null
          id?: string
          is_paid_user?: boolean | null
          last_activity_at?: string | null
          manual_tdee_override?: number | null
          monthly_ai_requests?: number | null
          onboarding_completed?: boolean | null
          payment_method?: string | null
          payment_provider?: string | null
          platform_subscription_id?: string | null
          premium_expires_at?: string | null
          sex?: string | null
          speech_model?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_product_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          transcription_model?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          tts_model?: string | null
          tts_voice?: string | null
          units?: string | null
          updated_at?: string
          user_id: string
          user_tier?: Database["public"]["Enums"]["user_tier"] | null
          weight?: number | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          activity_level?: string | null
          age?: number | null
          ai_requests_reset_date?: string | null
          apple_transaction_id?: string | null
          created_at?: string
          daily_calorie_goal?: number | null
          daily_carb_goal?: number | null
          default_walking_speed?: number | null
          deletion_reason?: string | null
          deletion_scheduled_at?: string | null
          display_name?: string | null
          enable_ceramic_animations?: boolean | null
          enable_daily_reset?: boolean | null
          enable_fasting_slideshow?: boolean | null
          enable_food_image_generation?: boolean | null
          enable_walking_slideshow?: boolean | null
          goal_weight?: number | null
          google_play_purchase_token?: string | null
          height?: number | null
          id?: string
          is_paid_user?: boolean | null
          last_activity_at?: string | null
          manual_tdee_override?: number | null
          monthly_ai_requests?: number | null
          onboarding_completed?: boolean | null
          payment_method?: string | null
          payment_provider?: string | null
          platform_subscription_id?: string | null
          premium_expires_at?: string | null
          sex?: string | null
          speech_model?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_product_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          transcription_model?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          tts_model?: string | null
          tts_voice?: string | null
          units?: string | null
          updated_at?: string
          user_id?: string
          user_tier?: Database["public"]["Enums"]["user_tier"] | null
          weight?: number | null
        }
        Relationships: []
      }
      ring_bell_gallery_items: {
        Row: {
          back_image_url: string | null
          back_text: string | null
          created_at: string
          front_image_url: string | null
          front_text: string | null
          id: string
          initial_state: string
          is_active: boolean
          order_position: number
          updated_at: string
        }
        Insert: {
          back_image_url?: string | null
          back_text?: string | null
          created_at?: string
          front_image_url?: string | null
          front_text?: string | null
          id?: string
          initial_state?: string
          is_active?: boolean
          order_position: number
          updated_at?: string
        }
        Update: {
          back_image_url?: string | null
          back_text?: string | null
          created_at?: string
          front_image_url?: string | null
          front_text?: string | null
          id?: string
          initial_state?: string
          is_active?: boolean
          order_position?: number
          updated_at?: string
        }
        Relationships: []
      }
      shared_settings: {
        Row: {
          created_at: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      social_proof: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          logo_url: string | null
          metric_label: string
          metric_value: string
          source_name: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          metric_label: string
          metric_value: string
          source_name: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          metric_label?: string
          metric_value?: string
          source_name?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string | null
          avatar_url: string | null
          content: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          rating: number | null
          updated_at: string
        }
        Insert: {
          author_name: string
          author_role?: string | null
          avatar_url?: string | null
          content: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          rating?: number | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_role?: string | null
          avatar_url?: string | null
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      tooltip_content: {
        Row: {
          content: string
          content_key: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          content: string
          content_key: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_key?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      usage_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          requests_count: number | null
          subscription_status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          requests_count?: number | null
          subscription_status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          requests_count?: number | null
          subscription_status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_conversation_context: {
        Row: {
          common_foods: Json | null
          conversation_patterns: Json | null
          created_at: string | null
          food_preferences: Json | null
          frequent_clarifications: string[] | null
          id: string
          last_updated: string | null
          preferred_units: string | null
          typical_serving_sizes: Json | null
          user_id: string
        }
        Insert: {
          common_foods?: Json | null
          conversation_patterns?: Json | null
          created_at?: string | null
          food_preferences?: Json | null
          frequent_clarifications?: string[] | null
          id?: string
          last_updated?: string | null
          preferred_units?: string | null
          typical_serving_sizes?: Json | null
          user_id: string
        }
        Update: {
          common_foods?: Json | null
          conversation_patterns?: Json | null
          created_at?: string | null
          food_preferences?: Json | null
          frequent_clarifications?: string[] | null
          id?: string
          last_updated?: string | null
          preferred_units?: string | null
          typical_serving_sizes?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_coupons: {
        Row: {
          coupon_code_id: string
          days_granted: number
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          coupon_code_id: string
          days_granted: number
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          coupon_code_id?: string
          days_granted?: number
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coupons_coupon_code_id_fkey"
            columns: ["coupon_code_id"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_foods: {
        Row: {
          calories_per_100g: number
          carbs_per_100g: number
          created_at: string
          id: string
          image_url: string | null
          is_favorite: boolean | null
          name: string
          updated_at: string
          user_id: string
          variations: Json | null
        }
        Insert: {
          calories_per_100g: number
          carbs_per_100g: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          name: string
          updated_at?: string
          user_id: string
          variations?: Json | null
        }
        Update: {
          calories_per_100g?: number
          carbs_per_100g?: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
          variations?: Json | null
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
      walking_sessions: {
        Row: {
          calories_burned: number | null
          created_at: string
          deleted_at: string | null
          distance: number | null
          edit_reason: string | null
          end_time: string | null
          estimated_steps: number | null
          id: string
          is_edited: boolean | null
          original_duration_minutes: number | null
          pause_start_time: string | null
          session_state: string | null
          speed_mph: number | null
          start_time: string
          status: string | null
          total_pause_duration: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          deleted_at?: string | null
          distance?: number | null
          edit_reason?: string | null
          end_time?: string | null
          estimated_steps?: number | null
          id?: string
          is_edited?: boolean | null
          original_duration_minutes?: number | null
          pause_start_time?: string | null
          session_state?: string | null
          speed_mph?: number | null
          start_time: string
          status?: string | null
          total_pause_duration?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          deleted_at?: string | null
          distance?: number | null
          edit_reason?: string | null
          end_time?: string | null
          estimated_steps?: number | null
          id?: string
          is_edited?: boolean | null
          original_duration_minutes?: number | null
          pause_start_time?: string | null
          session_state?: string | null
          speed_mph?: number | null
          start_time?: string
          status?: string | null
          total_pause_duration?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_referenced_images: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_name: string
          image_url: string
          record_count: number
          table_name: string
        }[]
      }
      get_page_seo_settings: {
        Args: { page_path_param: string }
        Returns: {
          is_indexed: boolean
          meta_description: string
          meta_title: string
          robots_directive: string
        }[]
      }
      get_payment_provider_for_platform: {
        Args: { _platform: string }
        Returns: string
      }
      get_user_profile_context: {
        Args: { user_uuid: string }
        Returns: string
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      redeem_coupon_code: {
        Args: { coupon_code: string }
        Returns: {
          days_granted: number
          message: string
          success: boolean
        }[]
      }
      test_auth_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      track_usage_event: {
        Args: {
          _event_type: string
          _requests_count?: number
          _subscription_status?: string
          _user_id: string
        }
        Returns: undefined
      }
      update_subscription_from_receipt: {
        Args: {
          _expires_at?: string
          _product_id: string
          _provider: string
          _status: string
          _subscription_id: string
          _user_id: string
        }
        Returns: undefined
      }
      update_user_tier: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_tier"]
      }
      user_has_premium_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_unified_auth_system: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: string
          status: string
          test_name: string
        }[]
      }
    }
    Enums: {
      access_level: "free" | "trial" | "premium" | "admin"
      app_role: "admin" | "user"
      user_tier: "api_user" | "paid_user" | "granted_user" | "free_user"
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
      access_level: ["free", "trial", "premium", "admin"],
      app_role: ["admin", "user"],
      user_tier: ["api_user", "paid_user", "granted_user", "free_user"],
    },
  },
} as const
