-- Add email, rank, and paymentProof fields to scouts table

-- Add email field
ALTER TABLE scouts 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add rank field
ALTER TABLE scouts 
ADD COLUMN IF NOT EXISTS rank TEXT;

-- Add payment_proof field (stores URL to file in Supabase storage)
ALTER TABLE scouts 
ADD COLUMN IF NOT EXISTS payment_proof TEXT;

-- Add comments for documentation
COMMENT ON COLUMN scouts.email IS 'Scout email address for communication';
COMMENT ON COLUMN scouts.rank IS 'Current scout rank: tenderfoot, second-class, first-class, eagle';
COMMENT ON COLUMN scouts.payment_proof IS 'URL to payment proof document in Supabase storage';

-- Create index on email for faster searches
CREATE INDEX IF NOT EXISTS idx_scouts_email_lookup ON scouts(email) WHERE email IS NOT NULL;




