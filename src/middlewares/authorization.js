import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const decoded = jwt.verify(
    token,
    process.env.SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      return decoded;
    }
  );

  const user = await User.findById(decoded.id, { password: 0 });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  next();
};

export const isModerator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }
  }

  return res.status(403).json({ message: "Require Moderator Role!" });
};
