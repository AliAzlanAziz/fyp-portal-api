import express, { Router } from "express";
import {
  checkReachable,
  postSignup,
  postSignin,
  postAcceptRequest,
  postRejectRequest,
  postCloseAdvisorRequest,
  getAllStudentRequests,
  getStudentRequest,
  getAdvisorForm,
  postAdvisorMarks,
} from "../controllers/advisor";
import { isAdvisorsContract } from "../middlewares/isAdvisorAuthorized";
import { isAdvisorAuthenticated } from "../middlewares/isRoleAuthenticated";

const router: Router = express.Router();

router.get("/", checkReachable);

router.post("/signup", postSignup);

router.post("/signin", postSignin);

router.post(
  "/accept/request",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postAcceptRequest
);

router.post(
  "/reject/request",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postRejectRequest
);

router.post(
  "/close/request",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postCloseAdvisorRequest
);

router.get("/requests", isAdvisorAuthenticated, getAllStudentRequests);

router.get(
  "/request/:id",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  getStudentRequest
);

router.get(
  "/form/:id",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  getAdvisorForm
);

router.post(
  "/contract/marks",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postAdvisorMarks
);

export default router;
