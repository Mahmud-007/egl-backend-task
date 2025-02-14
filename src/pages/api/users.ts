import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/dbConnect"; // Ensure your DB connection is established
import User from "../../models/User"; // Import your User model
import bcrypt from "bcryptjs"; // For password hashing
import authMiddleware from "@/lib/middleware/authMiddleware";

// API route to manage users
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure DB connection
  await connectDB();

  if (req.method === "GET") {
    const { id, page = 1, limit = 10 } = req.query; // Pagination params

    if (id && typeof id === "string") {
      try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching user", error });
      }
    } else {
      try {
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);

        const users = await User.find()
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize);

        const totalUsers = await User.countDocuments(); // Total number of users

        return res.status(200).json({
          users,
          pagination: {
            total: totalUsers,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(totalUsers / pageSize),
          },
        });
      } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error });
      }
    }
  } else if (req.method === "POST") {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      // Save the user
      await newUser.save();

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  } else {
    // Handle unsupported request methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

// Export the route wrapped in the auth middleware
export default authMiddleware(handler);
