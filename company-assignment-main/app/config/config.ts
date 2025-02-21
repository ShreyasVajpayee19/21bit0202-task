import dotenv from "dotenv";

dotenv.config();

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
