import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import offerScanRoutes from "./routes/offerScanRoutes.js";
import socialScanRoutes from "./routes/socialScanRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
	origin: 'http://localhost:8080', // Change to your frontend URL in production
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
}));


app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/offer-scan", offerScanRoutes);
app.use("/api/social-scan", socialScanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
