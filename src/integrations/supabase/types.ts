export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          candidate_id: string
          candidate_note: string | null
          created_at: string
          employer_note: string | null
          id: string
          job_id: string
          status: string
        }
        Insert: {
          candidate_id: string
          candidate_note?: string | null
          created_at?: string
          employer_note?: string | null
          id?: string
          job_id: string
          status?: string
        }
        Update: {
          candidate_id?: string
          candidate_note?: string | null
          created_at?: string
          employer_note?: string | null
          id?: string
          job_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          expiry_date: string | null
          id: string
          is_verified: boolean | null
          issue_date: string
          issuer: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          is_verified?: boolean | null
          issue_date: string
          issuer: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          is_verified?: boolean | null
          issue_date?: string
          issuer?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          created_at: string
          degree: string
          end_date: string | null
          field: string
          gpa: number | null
          id: string
          institution: string
          is_current: boolean | null
          start_date: string
          tier: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          degree: string
          end_date?: string | null
          field: string
          gpa?: number | null
          id?: string
          institution: string
          is_current?: boolean | null
          start_date: string
          tier?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          degree?: string
          end_date?: string | null
          field?: string
          gpa?: number | null
          id?: string
          institution?: string
          is_current?: boolean | null
          start_date?: string
          tier?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          role: string
          start_date: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          role: string
          start_date: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          role?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          closing_date: string | null
          created_at: string
          description: string
          employer_id: string
          id: string
          is_active: boolean | null
          job_type: string
          location: string
          min_experience: number | null
          min_rank_requirement: number | null
          required_skills: string[] | null
          salary_max: number | null
          salary_min: number | null
          title: string
        }
        Insert: {
          closing_date?: string | null
          created_at?: string
          description: string
          employer_id: string
          id?: string
          is_active?: boolean | null
          job_type: string
          location: string
          min_experience?: number | null
          min_rank_requirement?: number | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
        }
        Update: {
          closing_date?: string | null
          created_at?: string
          description?: string
          employer_id?: string
          id?: string
          is_active?: boolean | null
          job_type?: string
          location?: string
          min_experience?: number | null
          min_rank_requirement?: number | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          description: string
          duration_days: number
          features: string[] | null
          id: string
          is_active: boolean | null
          job_post_limit: number | null
          name: string
          price: number
          profile_view_limit: number | null
          user_type: string
        }
        Insert: {
          created_at?: string
          description: string
          duration_days: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          job_post_limit?: number | null
          name: string
          price: number
          profile_view_limit?: number | null
          user_type: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_days?: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          job_post_limit?: number | null
          name?: string
          price?: number
          profile_view_limit?: number | null
          user_type?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          available_cuts: string[] | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_fresh: boolean | null
          name: string
          origin: string | null
          price_per_kg: number
          rating: number | null
          review_count: number | null
          scientific_name: string | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          available_cuts?: string[] | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_fresh?: boolean | null
          name: string
          origin?: string | null
          price_per_kg: number
          rating?: number | null
          review_count?: number | null
          scientific_name?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          available_cuts?: string[] | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_fresh?: boolean | null
          name?: string
          origin?: string | null
          price_per_kg?: number
          rating?: number | null
          review_count?: number | null
          scientific_name?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          experience_years: number
          id: string
          is_verified: boolean | null
          level: number
          name: string
          user_id: string
          verification_source: string | null
        }
        Insert: {
          created_at?: string
          experience_years: number
          id?: string
          is_verified?: boolean | null
          level: number
          name: string
          user_id: string
          verification_source?: string | null
        }
        Update: {
          created_at?: string
          experience_years?: number
          id?: string
          is_verified?: boolean | null
          level?: number
          name?: string
          user_id?: string
          verification_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          package_id: string
          payment_reference: string | null
          payment_status: string
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          package_id: string
          payment_reference?: string | null
          payment_status?: string
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          package_id?: string
          payment_reference?: string | null
          payment_status?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          current_ctc: string | null
          email: string
          expected_ctc: string | null
          id: string
          industry: string | null
          is_premium: boolean | null
          name: string | null
          phone: string | null
          rank_score: number | null
          size: string | null
          user_type: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          current_ctc?: string | null
          email: string
          expected_ctc?: string | null
          id: string
          industry?: string | null
          is_premium?: boolean | null
          name?: string | null
          phone?: string | null
          rank_score?: number | null
          size?: string | null
          user_type: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          current_ctc?: string | null
          email?: string
          expected_ctc?: string | null
          id?: string
          industry?: string | null
          is_premium?: boolean | null
          name?: string | null
          phone?: string | null
          rank_score?: number | null
          size?: string | null
          user_type?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_candidate_rank: {
        Args: { user_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
