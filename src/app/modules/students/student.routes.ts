import express from 'express';
import { studentController } from './student.controller';

const router = express.Router();
router.get('/', studentController.retrieveStudents);
export const studentRoute = router;