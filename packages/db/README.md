# Database
## Structure
```text
├── package.json
├── src
│   ├── config
│   │   ├── pg_hba.conf
│   │   └── postgresql.conf
│   ├── index.ts
│   ├── supabase
│   │   ├── schema
│   │   │   ├── public
│   │   │   │   ├── tables
│   │   │   │   │   ├── prices.sql
│   │   │   │   │   ├── products.sql
│   │   │   │   │   ├── matched_products.sql
│   │   │   │   │   ├── retailers.sql
│   │   │   │   │   ├── retailer_categories.sql
│   │   │   │   ├── views
│   │   │   │   │   ├── coles_tracking_categories.sql
│   │   │   │   │   ├── wws_tracking_categories.sql
│   │   └── migrations
│       ├── 001_init.sql                                # Create database and schema
│       ├── 002_create_retailers.sql                    # Create retailers table
│       ├── 003_create_departments_categories.sql       # Create departments and categories tables
│       ├── 004_create_products.sql                     # Create products table  
│       ├── 005_create_product_prices.sql               # Create product prices table
│       ├── 006_create_indexes.sql                      # Create indexes for faster queries
│       ├── 007_create_triggers.sql                     # Create triggers
│       ├── 008_helper_functions.sql                    # Create helper functions
│       └── 009_create_views.sql                        # Create views   
├── tests
└── tsconfig.json
```
## Migrations
 The migration files are located in the `src/migrations` directory, and named with a number prefix to indicate the order in which they should be executed.

## Tech Stack
- PostgreSQL
- Supabase for database management and hosting