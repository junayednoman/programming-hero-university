import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { adminController } from './admin.controller';
import { adminValidations } from './admin.validation';
import authVerify from '../../middleware/auth';
import { USER_ROLE } from '../users/user.constant';
const router = express.Router();
router.get('/', authVerify(USER_ROLE.admin), adminController.getAllAdmins);
router.delete('/:adminId', adminController.deleteAdmin);
router.patch(
  '/:adminId',
  validateRequest(adminValidations.adminUpdateValidationSchema),
  adminController.updateAdmin,
);
export const adminRoutes = router;
