import express, { Router } from 'express';
import { checkReachable, postSignup, postSignin, postAcceptRequest, postRejectRequest,
    postCloseAdvisorRequest, getAllStudentRequests  } from '../controllers/advisor';
import { isAdvisorsContract } from '../middlewares/isAdvisorAuthorized';
import { isAdvisorAuthenticated } from '../middlewares/isRoleAuthenticated';

const router: Router = express.Router();

router.get('/', checkReachable);

router.post('/signup', postSignup);

router.post('/signin', postSignin);

router.post('/accept/request', isAdvisorAuthenticated, isAdvisorsContract, postAcceptRequest);

router.post('/reject/request', isAdvisorAuthenticated, isAdvisorsContract, postRejectRequest);

router.post('/close/request', isAdvisorAuthenticated, isAdvisorsContract, postCloseAdvisorRequest);

router.get('/requests', isAdvisorAuthenticated, getAllStudentRequests);

export default router;