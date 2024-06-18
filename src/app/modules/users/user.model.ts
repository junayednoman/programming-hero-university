import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['admin', 'faculty', 'student'] },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

// hash user password
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.hash_salt_rounds),
  );
  next();
});

// set empty string for password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const userModel = model<IUser>('users', userSchema);
