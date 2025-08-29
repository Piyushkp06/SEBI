import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import offerScanRoutes from "./routes/offerScanRoutes.js";
import socialScanRoutes from "./routes/socialScanRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/offer-scan", offerScanRoutes);
app.use("/api/social-scan", socialScanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
