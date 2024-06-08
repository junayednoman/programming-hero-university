import { TErrorSources, TGenericErrorResponse } from './../interface/error';
import mongoose from 'mongoose';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    message: 'Invalid Id',
    errorSources,
  };
};

export default handleCastError;
