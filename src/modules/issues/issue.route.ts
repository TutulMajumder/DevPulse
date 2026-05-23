import { Router } from "express";
import { issueController } from "./issue.controller";
import { USER_ROLES } from "../../types";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth(USER_ROLES.contributor, USER_ROLES.maintainer),
  issueController.createIssue,
);
router.get("/", issueController.getAllIssue);
router.get("/:id", issueController.getSingleIssue);
router.patch(
  "/:id",
  auth(USER_ROLES.contributor, USER_ROLES.maintainer),
  issueController.updateIssue,
);
router.delete(
  "/:id",
  auth(USER_ROLES.maintainer),
  issueController.deleteIssue,
);
export const issueRoute = router;
