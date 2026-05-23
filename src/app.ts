import express, { type Application } from "express";
import { userRoute } from "./modules/users/user.route";
import { issueRoute } from "./modules/issues/issue.route";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/issues", issueRoute);
app.use(cors());

export default app;
