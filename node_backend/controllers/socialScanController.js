// Get all social scans for a stock symbol
export const getScansByStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    const scans = await prisma.socialScan.findMany({
      where: {
        content: { contains: symbol, mode: 'insensitive' }
      },
      orderBy: { postedAt: 'desc' }
    });
    res.status(200).json(scans);
  } catch (error) {
    console.error('Error fetching scans by stock:', error.message);
    res.status(500).json({ error: 'Failed to fetch scans for stock' });
  }
};

// Trigger AI investigation for a stock symbol
import axios from "axios";
export const investigateStock = async (req, res) => {
  try {
    // Accept stock details from user (e.g., symbol, name, recent activity, etc.)
    const stockDetails = req.body;
    // Send stock details to Python backend for AI analysis
    const aiResponse = await axios.post('http://localhost:5000/ai/investigate-stock', stockDetails);
    res.status(200).json({
      message: 'AI investigation complete',
      result: aiResponse.data
    });
  } catch (error) {
    console.error('Error investigating stock:', error.message);
    res.status(500).json({ error: 'Failed to investigate stock' });
  }
};

// Mark a scan as false positive
export const markFalsePositive = async (req, res) => {
  try {
    const { id } = req.params;
    const scan = await prisma.socialScan.update({
      where: { id },
      data: { aiVerdict: 'false_positive' }
    });
    res.status(200).json({ message: 'Marked as false positive', scan });
  } catch (error) {
    console.error('Error marking false positive:', error.message);
    res.status(500).json({ error: 'Failed to mark as false positive' });
  }
};

// Report a scan for review
export const reportScan = async (req, res) => {
  try {
    const { id } = req.params;
    const scan = await prisma.socialScan.update({
      where: { id },
      data: { aiVerdict: 'reported' }
    });
    res.status(200).json({ message: 'Reported for review', scan });
  } catch (error) {
    console.error('Error reporting scan:', error.message);
    res.status(500).json({ error: 'Failed to report scan' });
  }
};
import prisma from "@prisma/client";

/**
 * @desc Scan a social media post/ad for fraud
 * @route POST /api/social/scan
 * @access Public
 */
export const scanSocialMedia = async (req, res) => {
  try {
    const { platform, username, profileLink, postText, links, contactInfo } = req.body;

    // Files (images/videos) uploaded to Supabase Storage
    const files = req.files ? req.files.map(f => f.path) : [];

    if (!platform || !username || !postText) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save submission in DB
    const scan = await prisma.socialScan.create({
      data: {
        platform,
        username,
        profileLink,
        postText,
        links,
        contactInfo,
        mediaFiles: files
      }
    });

    // Send to Python AI backend for fraud detection
    const aiResponse = await axios.post("http://localhost:5000/api/social-scan", {
      platform,
      username,
      profileLink,
      postText,
      links,
      contactInfo,
      mediaFiles: files
    });

    // Update DB with AI results
    const updatedScan = await prisma.socialScan.update({
      where: { id: scan.id },
      data: {
        aiScore: aiResponse.data.score,
        aiVerdict: aiResponse.data.verdict
      }
    });

    res.status(200).json({
      message: "Social media post scanned successfully",
      result: updatedScan
    });
  } catch (error) {
    console.error("Error scanning social media:", error.message);
    res.status(500).json({ error: "Failed to scan social media post" });
  }
};

/**
 * @desc Get all social media scans
 * @route GET /api/social
 * @access Admin
 */
export const getAllSocialScans = async (req, res) => {
  try {
    const scans = await prisma.socialScan.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(scans);
  } catch (error) {
    console.error("Error fetching social scans:", error.message);
    res.status(500).json({ error: "Failed to fetch social media scans" });
  }
};

/**
 * @desc Get single social media scan
 * @route GET /api/social/:id
 * @access Admin
 */
export const getSocialScanById = async (req, res) => {
  try {
    const { id } = req.params;
    const scan = await prisma.socialScan.findUnique({ where: { id: parseInt(id) } });

    if (!scan) return res.status(404).json({ error: "Scan not found" });

    res.status(200).json(scan);
  } catch (error) {
    console.error("Error fetching scan:", error.message);
    res.status(500).json({ error: "Failed to fetch scan" });
  }
};
