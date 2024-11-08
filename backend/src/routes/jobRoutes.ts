import express from "express";
import {
  createJobHandler,
  getJobsHandler,
  getJobByIdHandler,
} from "../controllers/jobController";

const router = express.Router();
router.route("/").post(createJobHandler).get(getJobsHandler);
router.route("/:id").get(getJobByIdHandler);

export default router;
