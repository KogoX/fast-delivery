-- M-Pesa Transactions Table
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkout_request_id TEXT NOT NULL,
  merchant_request_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('ride', 'food_order', 'package_delivery', 'errand')),
  reference_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  result_code INTEGER,
  result_desc TEXT,
  mpesa_receipt_number TEXT,
  transaction_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add payment fields to existing tables
ALTER TABLE rides ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE rides ADD COLUMN IF NOT EXISTS mpesa_receipt TEXT;

ALTER TABLE food_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE food_orders ADD COLUMN IF NOT EXISTS mpesa_receipt TEXT;

ALTER TABLE package_deliveries ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE package_deliveries ADD COLUMN IF NOT EXISTS mpesa_receipt TEXT;

ALTER TABLE errands ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE errands ADD COLUMN IF NOT EXISTS mpesa_receipt TEXT;

-- Enable RLS on mpesa_transactions
ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mpesa_transactions
CREATE POLICY "mpesa_select_own" ON mpesa_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mpesa_insert_own" ON mpesa_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mpesa_update_own" ON mpesa_transactions FOR UPDATE USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mpesa_checkout_request ON mpesa_transactions(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_user ON mpesa_transactions(user_id);
