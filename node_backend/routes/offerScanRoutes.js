import { Router } from "express";
import {
  scanInvestmentOffers,
  checkAdvisorCredentials,
  flagOffer,
  getFlaggedOffers,
  checkLegitimacy
} from "../controllers/offerScanController.js";

const offerScanRoutes = Router();

offerScanRoutes.post("/scan", scanInvestmentOffers);
offerScanRoutes.post("/check-advisor", checkAdvisorCredentials);
offerScanRoutes.post("/flag", flagOffer);
offerScanRoutes.get("/flagged", getFlaggedOffers);
offerScanRoutes.get("/legitimacy/:offerId", checkLegitimacy);

export default offerScanRoutes;
