import express, { type Application } from "express";
import { userRoute } from "./modules/users/user.route";
import { issueRoute } from "./modules/issues/issue.route";
import cors from "cors";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "DevPulse API is running 🚀" });
});
app.use("/api/auth", userRoute);
app.use("/api/issues", issueRoute);
app.use(
  cors({
    origin: "http://localhost:8000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

export default app;
