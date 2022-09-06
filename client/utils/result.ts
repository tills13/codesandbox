export function makeResult<T>(result: T): OkResult<T> {
  return { result, success: true };
}

export function makeErrorResult<E extends Error = Error>(
  error: E
): ErrorResult<E> {
  return { error, success: false };
}
