CREATE TABLE simulations (
  id INTEGER NOT NULL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  active_users INTEGER NOT NULL CHECK (active_users >= 0),
  storage INTEGER NOT NULL CHECK (storage >= 0),
  api_calls INTEGER NOT NULL CHECK (api_calls >= 0),
  base_cost_cents INTEGER NOT NULL CHECK (base_cost_cents >= 0),
  tax_rate_bps INTEGER NOT NULL CHECK (tax_rate_bps >= 0),
  tax_amount_cents INTEGER NOT NULL CHECK (tax_amount_cents >= 0),
  total_cents INTEGER NOT NULL CHECK (total_cents = base_cost_cents + tax_amount_cents),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (customer_id) REFERENCES customers (id)
) STRICT;
CREATE INDEX idx_simulations_customer_created ON simulations (customer_id, created_at);
