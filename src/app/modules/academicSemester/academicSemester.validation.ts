import { z } from 'zod';
import {
  AcademicSemesterCodes,
  AcademicSemesterMonths,
  AcademicSemesterNames,
} from './academicSemester.constant';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterNames] as [string, ...string[]]),
    year: z.string(),
    code: z.enum([...AcademicSemesterCodes] as [string, ...string[]]),
    startMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]),
    endMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]),
  }),
});
const updateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z
      .enum([...AcademicSemesterNames] as [string, ...string[]])
      .optional(),
    year: z.string().optional(),
    code: z
      .enum([...AcademicSemesterCodes] as [string, ...string[]])
      .optional(),
    startMonth: z
      .enum([...AcademicSemesterMonths] as [string, ...string[]])
      .optional(),
    endMonth: z
      .enum([...AcademicSemesterMonths] as [string, ...string[]])
      .optional(),
  }),
});

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
};
