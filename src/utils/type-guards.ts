import { ErrorResponse } from "../services/cities";

const isErrorResponse = (
  obj: ErrorResponse | { data: Array<number> }
): obj is ErrorResponse => {
  return (obj as ErrorResponse).error !== undefined;
};

export { isErrorResponse };
