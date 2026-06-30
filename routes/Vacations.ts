import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

type AuthUser = {
  userId: number;
  email: string;
  role: string;
};

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

const getUserFromAuthHeader = (req: Request): AuthUser | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: Number(decoded.userId),
      email: String(decoded.email || ""),
      role: String(decoded.role || "user"),
    };
  } catch {
    return null;
  }
};

const requireAuth = (req: Request, res: Response): AuthUser | null => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  return user;
};

const requireAdmin = (req: Request, res: Response): AuthUser | null => {
  const user = requireAuth(req, res);
  if (!user) {
    return null;
  }

  if (user.role !== "admin" && user.role !== "manager") {
    res.status(403).json({ message: "Admin or manager role is required" });
    return null;
  }

  return user;
};

const VacationsRoutes = (app: any, DB: any) => {
  // Lazy-initialize likes table so likes endpoints work immediately.
  DB.query(
    `CREATE TABLE IF NOT EXISTS vacation_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      vacation_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_vacation (user_id, vacation_id)
    )`
  ).catch((error: unknown) => {
    console.error("Error creating vacation_likes table:", error);
  });

  app.get("/vacations", async (req: Request, res: Response) => {
    try {
      const user = getUserFromAuthHeader(req);
      const userId = user?.userId || -1;

      const [rows] = await DB.query(
        `SELECT
          v.VacationID,
          v.Destination,
          v.Description,
          v.StartDate,
          v.EndDate,
          v.Price,
          v.ImageFileName,
          v.CreatedByUserID,
          COUNT(l.id) AS likesCount,
          MAX(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) AS likedByUser
        FROM vacations v
        LEFT JOIN vacation_likes l ON l.vacation_id = v.VacationID
        GROUP BY
          v.VacationID,
          v.Destination,
          v.Description,
          v.StartDate,
          v.EndDate,
          v.Price,
          v.ImageFileName,
          v.CreatedByUserID
        ORDER BY v.StartDate ASC`,
        [userId]
      );

      return res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching vacations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/vacations/:id", async (req: Request, res: Response) => {
    try {
      const vacationId = Number(req.params.id);
      const [rows] = await DB.query("SELECT * FROM vacations WHERE VacationID = ? LIMIT 1", [vacationId]);

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(404).json({ message: "Vacation not found" });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching vacation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/vacations", upload.single("image"), async (req: Request, res: Response) => {
    console.log("POST /vacations called");
    try {
      const user = requireAdmin(req, res);
      if (!user) {
        return;
      }

      const { destination, description, startDate, endDate, price } = req.body;
      const imageFileName = req.file?.filename || null;

      const [result] = await DB.query(
        "INSERT INTO vacations (Destination, Description, StartDate, EndDate, Price, ImageFileName, CreatedByUserID) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [destination, description, startDate, endDate, price, imageFileName, user.userId]
      );

      return res.status(201).json({
        message: "Vacation created successfully",
        vacationId: Number((result as any).insertId),
      });
    } catch (error) {
      console.error("Error creating vacation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/vacations/:id", upload.single("image"), async (req: Request, res: Response) => {
    console.log("PUT /vacations/:id called");
    try {
      const user = requireAdmin(req, res);
      if (!user) {
        return;
      }

      const vacationId = Number(req.params.id);
      const { destination, description, startDate, endDate, price } = req.body;
      const imageFileName = req.file?.filename || req.body.imageFileName || null;

      await DB.query(
        "UPDATE vacations SET Destination = ?, Description = ?, StartDate = ?, EndDate = ?, Price = ?, ImageFileName = ? WHERE VacationID = ?",
        [destination, description, startDate, endDate, price, imageFileName, vacationId]
      );

      return res.status(200).json({
        message: "Vacation updated successfully",
        vacationId,
      });
    } catch (error) {
      console.error("Error updating vacation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/vacations/:id", async (req: Request, res: Response) => {
    try {
      const user = requireAdmin(req, res);
      if (!user) {
        return;
      }

      const vacationId = Number(req.params.id);
      await DB.query("DELETE FROM vacation_likes WHERE vacation_id = ?", [vacationId]);
      await DB.query("DELETE FROM vacations WHERE VacationID = ?", [vacationId]);
      return res.status(200).json({ message: "Vacation deleted" });
    } catch (error) {
      console.error("Error deleting vacation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/vacations/:id/likes", async (req: Request, res: Response) => {
    try {
      const user = requireAuth(req, res);
      if (!user) {
        return;
      }

      const vacationId = Number(req.params.id);
      await DB.query("INSERT IGNORE INTO vacation_likes (user_id, vacation_id) VALUES (?, ?)", [
        user.userId,
        vacationId,
      ]);
      return res.status(201).json({ message: "Liked" });
    } catch (error) {
      console.error("Error liking vacation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/vacations/:id/likes", async (req: Request, res: Response) => {
    try {
      const user = requireAuth(req, res);
      if (!user) {
        return;
      }

      const vacationId = Number(req.params.id);
      await DB.query("DELETE FROM vacation_likes WHERE user_id = ? AND vacation_id = ?", [
        user.userId,
        vacationId,
      ]);
      return res.status(200).json({ message: "Unliked" });
    } catch (error) {
      console.error("Error unliking vacation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/likes/me", async (req: Request, res: Response) => {
    try {
      const user = requireAuth(req, res);
      if (!user) {
        return;
      }

      const [rows] = await DB.query("SELECT vacation_id FROM vacation_likes WHERE user_id = ?", [
        user.userId,
      ]);
      const vacationIds = Array.isArray(rows)
        ? rows.map((row: any) => Number(row.vacation_id))
        : [];

      return res.status(200).json({ vacationIds });
    } catch (error) {
      console.error("Error fetching likes:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/ai/recommendation", async (req: Request, res: Response) => {
    try {
      const user = requireAuth(req, res);
      if (!user) {
        return;
      }

      const destination = String(req.body.destination || "").trim();
      if (!destination) {
        return res.status(400).json({ message: "Destination is required" });
      }

      const [rows] = await DB.query(
        "SELECT Destination, Description, Price FROM vacations WHERE Destination LIKE ? ORDER BY StartDate ASC LIMIT 1",
        [`%${destination}%`]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const match = rows[0] as any;
        return res.status(200).json({
          recommendation: `Top match: ${match.Destination}. ${match.Description}. Price: $${Number(match.Price).toFixed(2)}.`,
        });
      }

      return res.status(200).json({
        recommendation: `No exact match found for ${destination}. Try broadening the destination name or browse upcoming vacations.`,
      });
    } catch (error) {
      console.error("Error getting recommendation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/mcp/chat", async (req: Request, res: Response) => {
    try {
      const user = requireAuth(req, res);
      if (!user) {
        return;
      }

      const question = String(req.body.question || "").toLowerCase();
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      if (question.includes("פעילות") || question.includes("active")) {
        const [rows] = await DB.query(
          "SELECT COUNT(*) AS count FROM vacations WHERE StartDate <= CURDATE() AND EndDate >= CURDATE()"
        );
        const count = Array.isArray(rows) ? Number((rows[0] as any).count || 0) : 0;
        return res.status(200).json({ answer: `There are currently ${count} active vacations.` });
      }

      if (question.includes("ממוצע") || question.includes("average")) {
        const [rows] = await DB.query("SELECT AVG(Price) AS avgPrice FROM vacations");
        const avgPrice = Array.isArray(rows) ? Number((rows[0] as any).avgPrice || 0) : 0;
        return res.status(200).json({ answer: `Average vacation price is $${avgPrice.toFixed(2)}.` });
      }

      if (question.includes("אירופה") || question.includes("europe")) {
        const europeHints = ["paris", "rome", "london", "berlin", "madrid", "amsterdam", "athens"];
        const [rows] = await DB.query(
          "SELECT Destination FROM vacations WHERE StartDate > CURDATE() ORDER BY StartDate ASC"
        );

        const destinations = Array.isArray(rows)
          ? rows
              .map((row: any) => String(row.Destination || ""))
              .filter((d: string) => europeHints.some((hint) => d.toLowerCase().includes(hint)))
          : [];

        const answer = destinations.length
          ? `Future Europe-related vacations: ${destinations.join(", ")}.`
          : "No future Europe-related vacations were found by destination keyword.";

        return res.status(200).json({ answer });
      }

      return res.status(200).json({
        answer: "I can answer vacation analytics questions like active count, average price, and future Europe vacations.",
      });
    } catch (error) {
      console.error("Error answering MCP chat:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
export default VacationsRoutes;
