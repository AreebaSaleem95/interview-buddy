export function getErrorMessage(error) {
  const msg = error?.response?.data?.message;
  if (typeof msg === 'string') return msg;
  if (error?.message) return error.message;
  return 'Something went wrong. Please try again.';
}
