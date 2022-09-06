declare type OkResult<T> = { success: true; result: T };
declare type ErrorResult = { success: false; error: string };
declare type Result<T> = OkResult<T> | ErrorResult;
