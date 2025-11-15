import jwt from "jsonwebtoken";

// Function to generate a token for a user
export const generateToken = (userId) => {
  // Always include a secret and expiration for security
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token valid for 7 days
  });

  return token;
};
