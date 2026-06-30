import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const VALID_ROLES = ["user", "manager", "admin", "employee"];

const toDbRole = (role: string): "Regular" | "Admin" | "Manager" => {
  const normalized = role.toLowerCase();
  if (normalized === "admin") return "Admin";
  if (normalized === "manager") return "Manager";
  return "Regular";
};

const fromDbRole = (role: string): "user" | "admin" | "manager" => {
  const normalized = role.toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "manager") return "manager";
  return "user";
};

const signToken = (userId: number, email: string, role: string) => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "24h" });
};

const UsersRoutes = (app: any, DB: any) => {
  app.get("/users/check-email", async (req: Request, res: Response) => {
    try {
      const email = String(req.query.email || "").trim();
      if (!email) {
        return res.status(400).json({ available: false, message: "Email is required" });
      }

      const [rows] = await DB.query("SELECT UserID FROM users WHERE Email = ? LIMIT 1", [email]);
      const exists = Array.isArray(rows) && rows.length > 0;
      return res.status(200).json({ available: !exists });
    } catch (error) {
      console.error("Error checking email:", error);
      return res.status(500).json({ available: false, message: "Internal server error" });
    }
  });

  app.post("/users", async (req: Request, res: Response) => {
    console.log("POST /users called");
    try {
      const { firstName, lastName, email, password, role } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const userRole = String(role || "user").toLowerCase();
      if (!VALID_ROLES.includes(userRole)) {
        return res.status(400).json({
          message: `Invalid role. Valid roles are: ${VALID_ROLES.join(", ")}`,
        });
      }

      const [existingRows] = await DB.query("SELECT UserID FROM users WHERE Email = ? LIMIT 1", [email]);
      if (Array.isArray(existingRows) && existingRows.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const dbRole = toDbRole(userRole);
      const [result] = await DB.query(
        "INSERT INTO users (FirstName, LastName, Email, Password, Role) VALUES (?, ?, ?, ?, ?)",
        [firstName, lastName, email, passwordHash, dbRole]
      );

      const insertId = Number((result as any).insertId);
      const token = signToken(insertId, email, userRole);

      return res.status(201).json({
        message: "User created successfully",
        userId: insertId,
        role: userRole,
        token,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const [rows] = await DB.query(
        "SELECT UserID, FirstName, LastName, Email, Password, Role FROM users WHERE Email = ? LIMIT 1",
        [email]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = rows[0] as any;
      const hashed = String(user.Password || "");
      const isHashed = hashed.startsWith("$2a$") || hashed.startsWith("$2b$") || hashed.startsWith("$2y$");
      const isValidPassword = isHashed
        ? await bcrypt.compare(password, hashed)
        : password === hashed;

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const userRole = fromDbRole(String(user.Role || "Regular"));
      const userId = Number(user.UserID);
      const userEmail = String(user.Email || email);
      const token = signToken(userId, userEmail, userRole);

      return res.status(200).json({
        token,
        userId,
        role: userRole,
        email: userEmail,
        firstName: String(user.FirstName || ""),
        lastName: String(user.LastName || ""),
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const [rows] = await DB.query(
        "SELECT UserID, FirstName, LastName, Email, Role FROM users WHERE UserID = ? LIMIT 1",
        [userId]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
export default UsersRoutes;