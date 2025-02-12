import jwt from 'jsonwebtoken';

// Secret key for signing the JWT (should be stored securely)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Function to generate a JWT
export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour
};

// Function to verify a JWT
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;  // If the token is invalid or expired
  }
};
