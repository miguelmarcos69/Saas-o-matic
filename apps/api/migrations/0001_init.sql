CREATE TABLE customers (
  id INTEGER NOT NULL PRIMARY KEY,
  company_name TEXT NOT NULL CHECK (length(trim(company_name)) > 0),
  tax_id TEXT NOT NULL CHECK (length(trim(tax_id)) > 0),
  email TEXT NOT NULL CHECK (length(trim(email)) > 0),
  country TEXT NOT NULL CHECK (length(trim(country)) > 0),
  plan TEXT NOT NULL CHECK (length(trim(plan)) > 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (country, tax_id)
) STRICT;
