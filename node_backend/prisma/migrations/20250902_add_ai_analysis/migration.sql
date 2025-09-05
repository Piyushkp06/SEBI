-- CreateAiAnalysis
ALTER TABLE "InvestmentOffer" ADD COLUMN "aiAnalysis" JSONB;
ALTER TABLE "InvestmentOffer" ADD COLUMN "overallRisk" TEXT;
ALTER TABLE "InvestmentOffer" ADD COLUMN "riskScore" INTEGER;
ALTER TABLE "InvestmentOffer" ADD COLUMN "fraudProbability" INTEGER;
