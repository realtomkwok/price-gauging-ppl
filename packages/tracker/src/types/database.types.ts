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
      matched_products: {
        Row: {
          created_at: string | null
          external_id: string
          match_confidence: number | null
          match_id: string
          retailer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          external_id: string
          match_confidence?: number | null
          match_id?: string
          retailer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          external_id?: string
          match_confidence?: number | null
          match_id?: string
          retailer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matched_products_product_fkey"
            columns: ["retailer_id", "external_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["retailer_id", "external_id"]
          },
        ]
      }
      prices: {
        Row: {
          created_at: string | null
          current_price: number
          external_id: string
          in_store_price: number | null
          is_on_special: boolean | null
          retailer_id: string
          special_type: string[]
          unit_measurement: string
          unit_price: number
          updated_at: string
          was_price: number | null
        }
        Insert: {
          created_at?: string | null
          current_price: number
          external_id: string
          in_store_price?: number | null
          is_on_special?: boolean | null
          retailer_id: string
          special_type?: string[]
          unit_measurement: string
          unit_price: number
          updated_at: string
          was_price?: number | null
        }
        Update: {
          created_at?: string | null
          current_price?: number
          external_id?: string
          in_store_price?: number | null
          is_on_special?: boolean | null
          retailer_id?: string
          special_type?: string[]
          unit_measurement?: string
          unit_price?: number
          updated_at?: string
          was_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_fkey"
            columns: ["retailer_id", "external_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["retailer_id", "external_id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          categories: string[]
          created_at: string | null
          description: string | null
          external_id: string
          image_urls: string[]
          is_available: boolean | null
          metadata: Json | null
          name: string
          package_size: string
          retailer_id: string
          search_vector: unknown | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          categories?: string[]
          created_at?: string | null
          description?: string | null
          external_id: string
          image_urls?: string[]
          is_available?: boolean | null
          metadata?: Json | null
          name: string
          package_size: string
          retailer_id: string
          search_vector?: unknown | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          categories?: string[]
          created_at?: string | null
          description?: string | null
          external_id?: string
          image_urls?: string[]
          is_available?: boolean | null
          metadata?: Json | null
          name?: string
          package_size?: string
          retailer_id?: string
          search_vector?: unknown | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_categories: {
        Row: {
          category_id: string
          category_level: number | null
          created_at: string | null
          external_endpoint: string
          external_id: string
          external_name: string
          product_count: number | null
          retailer_id: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          category_level?: number | null
          created_at?: string | null
          external_endpoint: string
          external_id: string
          external_name: string
          product_count?: number | null
          retailer_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          category_level?: number | null
          created_at?: string | null
          external_endpoint?: string
          external_id?: string
          external_name?: string
          product_count?: number | null
          retailer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_categories_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailers: {
        Row: {
          base_url: string | null
          category_endpoint: string | null
          created_at: string | null
          id: string
          name: string
          product_endpoint: string | null
          updated_at: string | null
        }
        Insert: {
          base_url?: string | null
          category_endpoint?: string | null
          created_at?: string | null
          id: string
          name: string
          product_endpoint?: string | null
          updated_at?: string | null
        }
        Update: {
          base_url?: string | null
          category_endpoint?: string | null
          created_at?: string | null
          id?: string
          name?: string
          product_endpoint?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      coles_tracking_categories: {
        Row: {
          endpoint: string | null
          id: string | null
          name: string | null
          product_count: number | null
          updated_at: string | null
        }
        Insert: {
          endpoint?: string | null
          id?: string | null
          name?: string | null
          product_count?: number | null
          updated_at?: string | null
        }
        Update: {
          endpoint?: string | null
          id?: string | null
          name?: string | null
          product_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wws_tracking_categories: {
        Row: {
          endpoint: string | null
          id: string | null
          name: string | null
          product_count: number | null
          updated_at: string | null
        }
        Insert: {
          endpoint?: string | null
          id?: string | null
          name?: string | null
          product_count?: number | null
          updated_at?: string | null
        }
        Update: {
          endpoint?: string | null
          id?: string | null
          name?: string | null
          product_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_latest_price: {
        Args: {
          internal_product_id: string
        }
        Returns: {
          current_price: number
          was_price: number
          unit_price: number
          unit_measurement: string
          is_on_special: boolean
          special_type: string[]
          tracked_at: string
        }[]
      }
      search_products: {
        Args: {
          keywords: string
          min_rank?: number
        }
        Returns: {
          product_id: string
          retailer_id: string
          name: string
          brand: string
          categories: string[]
          search_rank: number
        }[]
      }
    }
    Enums: {
      category_level: "department" | "category" | "subcategory"
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
