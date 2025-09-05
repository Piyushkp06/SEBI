
import axios from "axios";
import prisma from "../prisma/prismaClient.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import FormData from "form-data";

// Setup file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

/**
 * Controller: Scan investment offers for fraud risk
 */
export const scanInvestmentOffers = async (req, res) => {
  try {
    // Defensive: ensure req.body is always an object
    const safeBody = req.body && typeof req.body === 'object' ? req.body : {};
    const {
      links = null,
      emails = null,
      companyName = null,
      advisorName = null,
      contactInfo = null,
      platform = null,
      contentType = null,
      contentUrl = null,
      description = null,
      advisorId = null
    } = safeBody;

    // Collect file paths for uploaded files
    const uploadedFiles = req.files ? req.files.map((f) => f.path) : [];

    // Build payload for Python backend
    const formData = new FormData();
    
    // Add text data
    formData.append('textData', JSON.stringify({
      links,
      emails,
      companyName,
      advisorName,
      contactInfo
    }));

    // Add content type
    formData.append('contentType', contentType || 'text');
    
    // Add files if any
    if (uploadedFiles.length > 0) {
      for (const filePath of uploadedFiles) {
        const fileStream = fs.createReadStream(filePath);
        formData.append('files', fileStream, {
          filename: path.basename(filePath)
        });
      }
    }

    // Send to Python backend (FastAPI)
    const aiResponse = await axios.post(
      "http://localhost:5000/api/v1/offers/analyze",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Accept': 'application/json',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    // Save offer details and AI analysis in InvestmentOffer
    const offer = await prisma.investmentOffer.create({
      data: {
        platform,
        contentType,
        contentUrl,
        description,
        advisorId,
        aiAnalysis: aiResponse.data,
        overallRisk: aiResponse.data.overallRisk,
        riskScore: aiResponse.data.riskScore,
        fraudProbability: aiResponse.data.fraudProbability,
        // If risk is high, automatically flag the offer
        flagged: aiResponse.data.overallRisk === 'high'
      },
    });

    res.status(200).json({
      message: "Offer scanned and saved successfully",
      analysis: aiResponse.data,
      offer,
    });

    // Cleanup uploaded files
    uploadedFiles.forEach((filePath) => fs.unlinkSync(filePath));
  } catch (err) {
    console.error("Error scanning investment offer:", err);
    res.status(500).json({ message: "Error scanning investment offer", error: err.message });
  }
};



export const checkAdvisorCredentials = async (req, res) => {
  try {
    const { userId, licenseId, regulator, name } = req.body;
    
    // Call Python backend with form data
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('licenseId', licenseId);
    formData.append('regulator', regulator);
    formData.append('name', name);
    
    const response = await axios.post(
      "http://localhost:5000/api/v1/advisors/verify",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Accept': 'application/json'
        }
      }
    );
    res.status(200).json({
      message: "Advisor credentials checked successfully",
      result: response.data,
    });
  } catch (err) {
    console.error("Error checking advisor credentials:", err);
    res.status(500).json({ message: "Error checking advisor credentials", error: err.message });
  }
};

// Flag an offer as suspicious, store reason & risk score
export const flagOffer = async (req, res) => {
  try {
    const { offerId, flaggedBy, reason, riskScore } = req.body;
    // Create OfferFlag
    const flag = await prisma.offerFlag.create({
      data: { offerId, flaggedBy, reason, riskScore }
    });
    // Mark offer as flagged
    await prisma.investmentOffer.update({
      where: { id: offerId },
      data: { flagged: true }
    });
    res.status(200).json({ message: "Offer flagged successfully", flag });
  } catch (err) {
    console.error("Error flagging offer:", err);
    res.status(500).json({ message: "Error flagging offer", error: err.message });
  }
};

// List flagged offers for regulators
export const getFlaggedOffers = async (req, res) => {
  try {
    const offers = await prisma.investmentOffer.findMany({
      where: { flagged: true },
      include: { flags: true, advisor: true }
    });
    res.status(200).json({ offers });
  } catch (err) {
    console.error("Error fetching flagged offers:", err);
    res.status(500).json({ message: "Error fetching flagged offers", error: err.message });
  }
};

// Return status to investor (legit / flagged / pending)
export const checkLegitimacy = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await prisma.investmentOffer.findUnique({ where: { id: offerId } });
    if (!offer) return res.status(404).json({ status: "pending", message: "Offer not found" });
    if (offer.flagged) {
      return res.json({ status: "flagged", message: "This offer has been flagged as suspicious." });
    }
    return res.json({ status: "legit", message: "This offer is not flagged." });
  } catch (err) {
    console.error("Error checking legitimacy:", err);
    res.status(500).json({ status: "pending", message: "Error checking legitimacy", error: err.message });
  }
};