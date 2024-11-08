import express from "express";
import {
  createJobHandler,
  getJobsHandler,
  getJobByIdHandler,
} from "../controllers/jobController";

const router = express.Router();
router.route("/").post(createJobHandler).get(getJobsHandler);
router.route("/:id").get(getJobByIdHandler);

// router.post("/jobs", createJobHandler);
// router.get("/jobs", getJobsHandler);
// router.get("/jobs/:id", getJobByIdHandler);

export default router;
