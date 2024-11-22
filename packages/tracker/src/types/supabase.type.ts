export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          external_endpoint: string
          external_id: string
          external_name: string
          id: number
          retailer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          external_endpoint: string
          external_id: string
          external_name: string
          id?: number
          retailer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          external_endpoint?: string
          external_id?: string
          external_name?: string
          id?: number
          retailer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          created_at: string | null
          current_price: number
          id: string
          is_on_special: boolean | null
          product_id: string
          special_type: string[]
          tracked_at: string
          unit_measurement: string
          unit_price: number
          was_price: number | null
        }
        Insert: {
          created_at?: string | null
          current_price: number
          id?: string
          is_on_special?: boolean | null
          product_id: string
          special_type?: string[]
          tracked_at: string
          unit_measurement: string
          unit_price: number
          was_price?: number | null
        }
        Update: {
          created_at?: string | null
          current_price?: number
          id?: string
          is_on_special?: boolean | null
          product_id?: string
          special_type?: string[]
          tracked_at?: string
          unit_measurement?: string
          unit_price?: number
          was_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string
          categories: string[]
          created_at: string | null
          description: string | null
          external_id: string
          id: string
          image_urls: string[]
          is_available: boolean | null
          last_synced_at: string | null
          metadata: Json | null
          name: string
          package_size: string
          retailer_id: string
          search_vector: unknown | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          brand: string
          categories?: string[]
          created_at?: string | null
          description?: string | null
          external_id: string
          id?: string
          image_urls?: string[]
          is_available?: boolean | null
          last_synced_at?: string | null
          metadata?: Json | null
          name: string
          package_size: string
          retailer_id: string
          search_vector?: unknown | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string
          categories?: string[]
          created_at?: string | null
          description?: string | null
          external_id?: string
          id?: string
          image_urls?: string[]
          is_available?: boolean | null
          last_synced_at?: string | null
          metadata?: Json | null
          name?: string
          package_size?: string
          retailer_id?: string
          search_vector?: unknown | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prodcuts_retailer_id_fkey"
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
          category_endpoint: string | null
          created_at: string | null
          id: string
          name: string
          product_endpoint: string | null
          updated_at: string | null
        }
        Insert: {
          category_endpoint?: string | null
          created_at?: string | null
          id: string
          name: string
          product_endpoint?: string | null
          updated_at?: string | null
        }
        Update: {
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
      category_stats: {
        Row: {
          avg_price: number | null
          category: string | null
          product_count: number | null
          retailer_count: number | null
        }
        Relationships: []
      }
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
      product_details: {
        Row: {
          barcode: string | null
          brand: string | null
          categories: string[] | null
          created_at: string | null
          current_price: number | null
          description: string | null
          external_id: string | null
          id: string | null
          image_urls: string[] | null
          is_available: boolean | null
          is_on_special: boolean | null
          last_synced_at: string | null
          metadata: Json | null
          name: string | null
          package_size: string | null
          price_tracked_at: string | null
          retailer_id: string | null
          retailer_name: string | null
          search_vector: unknown | null
          special_type: string[] | null
          unit_measurement: string | null
          unit_price: number | null
          updated_at: string | null
          was_price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prodcuts_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
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
