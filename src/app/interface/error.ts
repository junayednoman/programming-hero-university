export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  message: string;
  errorSources: TErrorSources;
};
