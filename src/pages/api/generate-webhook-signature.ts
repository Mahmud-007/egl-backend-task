import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Secret key (same as the webhook verification key)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Make sure the body contains eventType and data
  const { eventType, data } = req.body;

  if (!eventType || !data) {
    return res.status(400).json({ message: "eventType and data are required" });
  }

  try {
    // Create the payload object and stringify it
    const payload = {
      eventType,
      data,
    };

    // Generate the signature based on the payload
    const signature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    return res.status(200).json({ signature });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error generating signature", error });
  }
}
