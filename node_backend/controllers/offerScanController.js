
import axios from "axios";
import prisma from "../prisma/prismaClient.js";
import multer from "multer";
import path from "path";
import fs from "fs";

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
    const { links, emails, companyName, advisorName, contactInfo, platform, contentType, contentUrl, description, advisorId } = req.body;

    // Collect file paths for uploaded files
    const uploadedFiles = req.files ? req.files.map((f) => f.path) : [];

    // Build payload for Python backend
    const payload = {
      textData: {
        links,
        emails,
        companyName,
        advisorName,
        contactInfo,
      },
    };

    // Send JSON first
    const aiResponse = await axios.post("http://localhost:5000/analyze-offer", payload);

    // Then upload files one by one if needed
    for (const filePath of uploadedFiles) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filePath));

      await axios.post("http://localhost:5000/upload-media", formData, {
        headers: formData.getHeaders(),
      });
    }

    // Save offer details in InvestmentOffer
    const offer = await prisma.investmentOffer.create({
      data: {
        platform,
        contentType,
        contentUrl,
        description,
        advisorId,
        // You can add more fields as needed
        // Optionally, store analysis result as JSON if you add a field for it
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
    // Build payload for Python backend
    const payload = { userId, licenseId, regulator, name };
    // Call Python backend
    const response = await axios.post("http://localhost:5000/check-advisor", payload);
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