-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('single', 'average', 'ao12');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardRecord" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" "RecordType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeaderboardRecord_eventId_type_idx" ON "LeaderboardRecord"("eventId", "type");

-- AddForeignKey
ALTER TABLE "LeaderboardRecord" ADD CONSTRAINT "LeaderboardRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
