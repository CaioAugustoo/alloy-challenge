export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong. Please try again later.";

  if (err instanceof Error) {
    return err.message;
  }
  if (err as { error: string }) {
    return (err as { error: string }).error;
  } else {
    return unknownError;
  }
}
