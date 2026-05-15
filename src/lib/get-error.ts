/* eslint-disable @typescript-eslint/no-explicit-any */
export function getErrorMessage(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.title ||
    err?.message ||
    "Something went wrong"
  );
}