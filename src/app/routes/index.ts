import { Router } from 'express';
import { studentRoute } from '../modules/students/student.routes';
import { userRoutes } from '../modules/users/user.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';

const router = Router();

const apiRoutes = [
  { path: '/students', route: studentRoute },
  { path: '/users', route: userRoutes },
  { path: '/academic-semesters/', route: AcademicSemesterRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
