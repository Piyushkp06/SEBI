/*
  Warnings:

  - You are about to drop the column `postId` on the `StockActivityLink` table. All the data in the column will be lost.
  - You are about to drop the `SocialPost` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scanId` to the `StockActivityLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StockActivityLink" DROP CONSTRAINT "StockActivityLink_postId_fkey";

-- AlterTable
ALTER TABLE "public"."StockActivityLink" DROP COLUMN "postId",
ADD COLUMN     "scanId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."SocialPost";

-- CreateTable
CREATE TABLE "public"."SocialScan" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "author" TEXT,
    "postUrl" TEXT,
    "content" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3),
    "suspicious" BOOLEAN NOT NULL DEFAULT false,
    "aiScore" DOUBLE PRECISION,
    "aiVerdict" TEXT,

    CONSTRAINT "SocialScan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."StockActivityLink" ADD CONSTRAINT "StockActivityLink_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "public"."SocialScan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
