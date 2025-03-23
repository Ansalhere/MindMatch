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
        Args: {
          user_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
