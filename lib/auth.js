import jwt from 'jsonwebtoken';
export async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return false;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    return true;
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return false;
  }
}