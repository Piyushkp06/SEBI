-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('INVESTOR', 'ADVISOR', 'REGULATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('VIDEO', 'AUDIO', 'DOCUMENT', 'TEXT', 'LINK');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'INVESTOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Advisor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "regulator" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvestmentOffer" (
    "id" TEXT NOT NULL,
    "platform" TEXT,
    "contentType" "public"."ContentType" NOT NULL,
    "contentUrl" TEXT,
    "description" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "advisorId" TEXT,

    CONSTRAINT "InvestmentOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OfferFlag" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "flaggedBy" TEXT NOT NULL,
    "reason" TEXT,
    "riskScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SocialPost" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "author" TEXT,
    "postUrl" TEXT,
    "content" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3),
    "suspicious" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StockActivityLink" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "stockSymbol" TEXT NOT NULL,
    "unusualActivity" BOOLEAN NOT NULL DEFAULT false,
    "activityDetails" JSONB,

    CONSTRAINT "StockActivityLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CorporateAnnouncement" (
    "id" TEXT NOT NULL,
    "companySymbol" TEXT NOT NULL,
    "announcementType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "announcedAt" TIMESTAMP(3) NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorporateAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnnouncementVerification" (
    "id" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "verificationType" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "details" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnnouncementVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnnouncementScore" (
    "id" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "credibilityScore" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnnouncementScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_userId_key" ON "public"."Advisor"("userId");

-- AddForeignKey
ALTER TABLE "public"."Advisor" ADD CONSTRAINT "Advisor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvestmentOffer" ADD CONSTRAINT "InvestmentOffer_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "public"."Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OfferFlag" ADD CONSTRAINT "OfferFlag_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "public"."InvestmentOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OfferFlag" ADD CONSTRAINT "OfferFlag_flaggedBy_fkey" FOREIGN KEY ("flaggedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockActivityLink" ADD CONSTRAINT "StockActivityLink_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."SocialPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnnouncementVerification" ADD CONSTRAINT "AnnouncementVerification_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "public"."CorporateAnnouncement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnnouncementScore" ADD CONSTRAINT "AnnouncementScore_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "public"."CorporateAnnouncement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
