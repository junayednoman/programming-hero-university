import { string, z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const regax = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return regax.test(time);
  },
  { message: 'Invalid time format, expected: HH:MM in 24 hour format' },
);

export const offeredCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: string(),
      academicDepartment: string(),
      academicFaculty: string(),
      course: string(),
      faculty: string(),
      maxCapacity: z.number().min(1),
      section: z.number(),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      days: z.array(z.enum([...(Days as [string, ...string[]])])),
    })
    .refine(
      (body) => {
        const startDateTime = new Date(`1970-01-01T${body.startTime}:00`);
        const endDateTime = new Date(`1970-01-01T${body.endTime}:00`);
        return endDateTime > startDateTime;
      },
      { message: 'Start time should be before end time' },
    ),
});

export const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: string(),
      maxCapacity: z.number().min(1).optional(),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      days: z.array(z.enum([...(Days as [string, ...string[]])])),
    })
    .refine(
      (body) => {
        const startDateTime = new Date(`1970-01-01T${body.startTime}:00`);
        const endDateTime = new Date(`1970-01-01T${body.endTime}:00`);
        return endDateTime > startDateTime;
      },
      { message: 'Start time should be before end time' },
    ),
});

export const offeredCourseValidations = {
  offeredCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
