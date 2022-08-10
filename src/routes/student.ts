import express, { Router } from 'express';
import { checkReachable, postSignup, postSignin, getAdvisors, postSelectAdvisor, postCloseAdvisorRequest,
    getAllAdvisorsRequest, getAdvisorRequest } from '../controllers/student';
import { isStudentAuthenticated } from '../middlewares/isRoleAuthenticated';
import { isStudentsContract } from '../middlewares/isStudentAuthorized';

const router: Router = express.Router();

router.get('/', checkReachable);

router.post('/signup', postSignup);

router.post('/signin', postSignin);

router.get('/advisors', isStudentAuthenticated, getAdvisors);

router.post('/request/advisor', isStudentAuthenticated, postSelectAdvisor);

router.post('/close/request', isStudentAuthenticated, isStudentsContract, postCloseAdvisorRequest);

router.get('/requests', isStudentAuthenticated, getAllAdvisorsRequest);

router.get('/request/:id', isStudentAuthenticated, isStudentsContract, getAdvisorRequest);

export default router;