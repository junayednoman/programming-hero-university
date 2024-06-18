import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import { TLoginUser } from './auth.interface';
import { userModel } from '../users/user.model';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  // check if the user exists
  const isUserExist = await userModel
    .findOne({ id: payload?.id })
    .select('+password');
  console.log(isUserExist);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check if the user is deleted
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = isUserExist.status;

  // check if the user is blocked
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // compare password
  const isPassMatch = await bcrypt.compare(
    payload?.password,
    isUserExist?.password,
  );

  if (!isPassMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is incorrect!');
  }

  // create token and send to the client
  const jwtPayload = {
    userId: isUserExist.id,
    role: isUserExist.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExist.needsPasswordChange,
  };
};

const changePasswordFromDb = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check if the user exists
  const isUserExist = await userModel
    .findOne({ id: user?.userId })
    .select('+password');

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check if the user is deleted
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = isUserExist.status;

  // check if the user is blocked
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // compare password
  const isPassMatch = await bcrypt.compare(
    payload?.oldPassword,
    isUserExist?.password,
  );

  if (!isPassMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is incorrect!');
  }

  // hash new password
  const newHashedPass = await bcrypt.hash(
    payload.newPassword,
    Number(config.hash_salt_rounds),
  );

  // update password
  await userModel.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    {
      password: newHashedPass,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (token: string) => {
  // verify access token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // check if the user exists
  const isUserExist = await userModel
    .findOne({ id: userId })
    .select('+password');

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check if the user is deleted
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = isUserExist.status;

  // check if the user is blocked
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const passwordChangedAtUtc = isUserExist.passwordChangedAt as Date;
  const passwordChangedAt = new Date(passwordChangedAtUtc).getTime() / 1000;
  const tokenIssuedAt = iat as number;

  if (passwordChangedAt > tokenIssuedAt) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized!');
  }

  // create token and send to the client
  const jwtPayload = {
    userId: isUserExist.id,
    role: isUserExist.role,
  };
  
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};
export const authServices = { loginUser, changePasswordFromDb, refreshToken };
