import User from "../models/User";
import Role from "../models/Role";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { username, email, password, roles = [] } = req.body;

  /* Crear usuario */
  const newUser = new User({
    username,
    email,
    roles,
    password: await User.encryptPassword(password),
  });

  /* Identificar roles */
  if (roles[0]) {
    const foundRoles = await Role.find({ name: { $in: roles } });
    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    const role = await Role.findOne({ name: "user" });
    newUser.roles = [role._id];
  }

  /* Guardar usuario */
  const savedUser = await newUser.save();

  /* Firmar token de paso */
  const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY, {
    expiresIn: 86400, // 24 hours
  });

  /* Respuesta */
  res.status(200).json({
    message: "Register successful",
    token,
    savedUser,
  });
};

export const signIn = async (req, res) => {
  /* Buscar usuario */
  const userFound = await User.findOne({ email: req.body.email }).populate(
    "roles"
  );

  /* Validar usuario */
  if (!userFound) return res.status(400).json({ message: "User not found" });

  /* Validar contraseña */
  const matchPassword = await User.comparePassword(
    req.body.password,
    userFound.password
  );
  if (!matchPassword)
    return res.status(401).json({ token: null, message: "Invalid password" });

  /* Firmar token de paso */
  const token = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY, {
    expiresIn: 86400, // 24 hours
  });

  /* Respuesta */
  res.json({ message: "Login successful", token });
};
