import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { authControllers } from './auth.controller';
import { authValidations } from './auth.validation';
import authVerify from '../../middleware/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidations.userLoginValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  authVerify(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(authValidations.changePassValidation),
  authControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(authValidations.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

export const authRoutes = router;
