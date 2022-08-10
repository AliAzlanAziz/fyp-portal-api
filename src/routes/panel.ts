import express, { Router } from 'express';
import { checkReachable, postSignup, postSignin  } from '../controllers/panel';

const router: Router = express.Router();

router.get('/', checkReachable);

router.post('/signup', postSignup);

router.post('/signin', postSignin);

export default router;