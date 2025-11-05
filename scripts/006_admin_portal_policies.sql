-- Admin Portal RLS Policies
-- Only users with role 'admin' can access admin functions

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin can update user roles
CREATE POLICY "Admins can update profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin can view all donors
CREATE POLICY "Admins can view all donors"
ON donors FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin can view all students
CREATE POLICY "Admins can view all students"
ON students FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin can view all campaigns
CREATE POLICY "Admins can view all campaigns"
ON campaigns FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin can update campaigns
CREATE POLICY "Admins can update campaigns"
ON campaigns FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin can delete campaigns
CREATE POLICY "Admins can delete campaigns"
ON campaigns FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Admin can manage system settings
CREATE POLICY "Admins can view system settings"
ON system_settings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert system settings"
ON system_settings FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update system settings"
ON system_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin can view audit logs
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('site_name', '"Starehe Boys Centre - Donor Management"', 'Name of the institution'),
  ('contact_email', '"info@starehe.ac.ke"', 'Primary contact email'),
  ('contact_phone', '"+254 20 2712903"', 'Primary contact phone'),
  ('mpesa_paybill', '"123456"', 'M-Pesa Paybill number'),
  ('bank_account', '"1234567890"', 'Bank account number'),
  ('bank_name', '"Kenya Commercial Bank"', 'Bank name'),
  ('min_donation_amount', '100', 'Minimum donation amount in KES'),
  ('sponsorship_amount_monthly', '5000', 'Monthly sponsorship amount in KES'),
  ('enable_mpesa', 'true', 'Enable M-Pesa payments'),
  ('enable_card', 'true', 'Enable card payments'),
  ('enable_paypal', 'true', 'Enable PayPal payments'),
  ('enable_bank_transfer', 'true', 'Enable bank transfers')
ON CONFLICT (key) DO NOTHING;
