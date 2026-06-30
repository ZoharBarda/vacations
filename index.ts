import express, { Request, Response } from 'express';
import bodyParser from "body-parser"
import UsersRoutes from './routes/Useres';
import VacationsRoutes from './routes/Vacations';
import mysql from "mysql2/promise";
import path from "path";

export const DB = mysql.createPool({
    host: "localhost", //שם השרת
    user: "root",
    password: "rootpassword",
    database: "project3", //שם הדאטה בייס
    waitForConnections: true,
    connectionLimit: 10,
});

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  if (isLocalOrigin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Vary", "Origin");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
const port = 3000;

UsersRoutes(app, DB);
VacationsRoutes(app, DB);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with Express and TypeScript!');
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


