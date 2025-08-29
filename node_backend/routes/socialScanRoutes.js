
import { Router } from "express";
import {
  scanSocialMedia,
  getAllSocialScans,
  getSocialScanById,
  getScansByStock,
  investigateStock,
  markFalsePositive,
  reportScan
} from "../controllers/socialScanController.js";

const socialScanRoutes = Router();

socialScanRoutes.post("/scan", scanSocialMedia);
socialScanRoutes.get("/all", getAllSocialScans);
socialScanRoutes.get("/:id", getSocialScanById);
socialScanRoutes.get("/stock/:symbol", getScansByStock);
socialScanRoutes.post("/investigate/:symbol", investigateStock);
socialScanRoutes.post("/:id/false-positive", markFalsePositive);
socialScanRoutes.post("/:id/report", reportScan);

export default socialScanRoutes;
