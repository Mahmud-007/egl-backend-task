import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string; // Use a strong secret

// Type definition for webhook event data
interface WebhookEvent {
  eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  timestamp: string;
}

// Function to verify the request signature
const verifySignature = (req: NextApiRequest): boolean => {
  const signature = req.headers["x-signature"] as string;
  if (!signature) return false;

  const payload = JSON.stringify(req.body);
  const computedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return signature === computedSignature;
};

// Function to save data to db.json
const saveToDB = (data: WebhookEvent) => {
  const filePath = path.join(process.cwd(), "db.json");

  let existingData: WebhookEvent[] = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    existingData = JSON.parse(fileContent) as WebhookEvent[];
  }

  existingData.push(data);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  // Verify signature
  if (!verifySignature(req)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid signature" });
  }

  const { eventType, data } = req.body;

  if (!eventType || !data) {
    return res.status(400).json({ success: false, message: "Invalid payload" });
  }

  try {
    // Save event data
    saveToDB({ eventType, data, timestamp: new Date().toISOString() });

    res.status(200).json({ success: true, message: "Received" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error processing request", error });
  }
}
