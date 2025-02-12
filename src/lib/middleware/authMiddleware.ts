import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../auth";

// Extend the NextApiRequest type to include `user` property
interface CustomNextApiRequest extends NextApiRequest {
  user?: { id: string }; // Assuming the decoded token contains an `id` field
}

const authMiddleware =
  (
    handler: (req: CustomNextApiRequest, res: NextApiResponse) => Promise<void>
  ) =>
  async (req: CustomNextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = { id: decoded.id };

    return handler(req, res);
  };

export default authMiddleware;
