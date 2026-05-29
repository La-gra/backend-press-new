ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "verificationToken" TEXT;
ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "verificationTokenExpires" TIMESTAMP;
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_verificationToken_key" ON "Admin"("verificationToken");