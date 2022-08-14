import express, { Router } from 'express';
import { checkReachable, postSignup, postSignin, getAdvisors, getStudents  } from '../controllers/admin';
import { isAdminAuthenticated } from '../middlewares/isRoleAuthenticated';

const router: Router = express.Router();

router.get('/', checkReachable);

router.post('/signup', postSignup);

router.post('/signin', postSignin);

router.get('/advisors', isAdminAuthenticated, getAdvisors);

router.get('/students', isAdminAuthenticated, getStudents);

export default router;