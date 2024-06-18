/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsyncError from '../utils/catchAsyncError';
import { AppError } from '../errors/appError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/users/user.interface';
import { userModel } from '../modules/users/user.model';

const authVerify = (...allowedRoles: TUserRole[]) => {
  return catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
      }

      // verify access token
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { role, userId, iat } = decoded;

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
      if (allowedRoles && !allowedRoles.includes(role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Forbidden!');
      }

      req.user = decoded as JwtPayload;
      next();
    },
  );
};
export default authVerify;
