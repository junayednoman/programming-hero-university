import { Response } from 'express';
import httpStatus from 'http-status';

type TData<T> = {
  message: string;
  data: T;
};

const successResponse = <T>(res: Response, data: TData<T>) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: data.message,
    data: data.data,
  });
};

export default successResponse;
