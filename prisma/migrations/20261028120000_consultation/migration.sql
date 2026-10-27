CREATE TABLE "Consultation" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "catId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "symptoms" TEXT NOT NULL,
  "assessment" TEXT NOT NULL,
  "urgency" TEXT NOT NULL,
  "recommendation" TEXT NOT NULL,
  "sources" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Consultation_userId_sessionId_key" ON "Consultation"("userId", "sessionId");
CREATE INDEX "Consultation_userId_createdAt_idx" ON "Consultation"("userId", "createdAt");
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_catId_fkey"
  FOREIGN KEY ("catId") REFERENCES "Cat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
