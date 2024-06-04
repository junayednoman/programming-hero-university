import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .max(20, "password can't be more than 20")
    .optional(),
});

export default userValidationSchema;