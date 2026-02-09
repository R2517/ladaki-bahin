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
      bandkam_registrations: {
        Row: {
          aadhar_number: string | null
          activation_date: string | null
          amount: number
          applicant_name: string
          appointment_date: string | null
          created_at: string
          district: string | null
          dob: string | null
          expiry_date: string | null
          form_date: string
          id: string
          mobile_number: string | null
          online_date: string | null
          payment_mode: string | null
          payment_status: string
          received_amount: number
          registration_type: string
          status: string
          taluka: string | null
          village: string | null
        }
        Insert: {
          aadhar_number?: string | null
          activation_date?: string | null
          amount?: number
          applicant_name: string
          appointment_date?: string | null
          created_at?: string
          district?: string | null
          dob?: string | null
          expiry_date?: string | null
          form_date?: string
          id?: string
          mobile_number?: string | null
          online_date?: string | null
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
          registration_type?: string
          status?: string
          taluka?: string | null
          village?: string | null
        }
        Update: {
          aadhar_number?: string | null
          activation_date?: string | null
          amount?: number
          applicant_name?: string
          appointment_date?: string | null
          created_at?: string
          district?: string | null
          dob?: string | null
          expiry_date?: string | null
          form_date?: string
          id?: string
          mobile_number?: string | null
          online_date?: string | null
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
          registration_type?: string
          status?: string
          taluka?: string | null
          village?: string | null
        }
        Relationships: []
      }
      bandkam_schemes: {
        Row: {
          amount: number
          applicant_name: string
          apply_date: string | null
          appointment_date: string | null
          beneficiary_name: string | null
          commission_amount: number
          commission_percent: number
          created_at: string
          delivery_date: string | null
          id: string
          payment_mode: string | null
          payment_status: string
          received_amount: number
          registration_id: string | null
          scheme_type: string
          scholarship_category: string | null
          status: string
          student_name: string | null
          year: string | null
        }
        Insert: {
          amount?: number
          applicant_name: string
          apply_date?: string | null
          appointment_date?: string | null
          beneficiary_name?: string | null
          commission_amount?: number
          commission_percent?: number
          created_at?: string
          delivery_date?: string | null
          id?: string
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
          registration_id?: string | null
          scheme_type: string
          scholarship_category?: string | null
          status?: string
          student_name?: string | null
          year?: string | null
        }
        Update: {
          amount?: number
          applicant_name?: string
          apply_date?: string | null
          appointment_date?: string | null
          beneficiary_name?: string | null
          commission_amount?: number
          commission_percent?: number
          created_at?: string
          delivery_date?: string | null
          id?: string
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
          registration_id?: string | null
          scheme_type?: string
          scholarship_category?: string | null
          status?: string
          student_name?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bandkam_schemes_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "bandkam_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          applicant_name: string
          created_at: string
          form_data: Json
          form_type: string
          id: string
        }
        Insert: {
          applicant_name: string
          created_at?: string
          form_data?: Json
          form_type: string
          id?: string
        }
        Update: {
          applicant_name?: string
          created_at?: string
          form_data?: Json
          form_type?: string
          id?: string
        }
        Relationships: []
      }
      pan_card_applications: {
        Row: {
          amount: number
          applicant_name: string
          application_number: string
          application_type: string
          created_at: string
          dob: string | null
          id: string
          mobile_number: string | null
          payment_mode: string | null
          payment_status: string
          received_amount: number
        }
        Insert: {
          amount?: number
          applicant_name: string
          application_number: string
          application_type?: string
          created_at?: string
          dob?: string | null
          id?: string
          mobile_number?: string | null
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
        }
        Update: {
          amount?: number
          applicant_name?: string
          application_number?: string
          application_type?: string
          created_at?: string
          dob?: string | null
          id?: string
          mobile_number?: string | null
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
        }
        Relationships: []
      }
      voter_id_applications: {
        Row: {
          amount: number
          applicant_name: string
          application_number: string
          application_type: string
          created_at: string
          dob: string | null
          id: string
          mobile_number: string | null
          payment_mode: string | null
          payment_status: string
          received_amount: number
        }
        Insert: {
          amount?: number
          applicant_name: string
          application_number: string
          application_type?: string
          created_at?: string
          dob?: string | null
          id?: string
          mobile_number?: string | null
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
        }
        Update: {
          amount?: number
          applicant_name?: string
          application_number?: string
          application_type?: string
          created_at?: string
          dob?: string | null
          id?: string
          mobile_number?: string | null
          payment_mode?: string | null
          payment_status?: string
          received_amount?: number
        }
        Relationships: []
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
