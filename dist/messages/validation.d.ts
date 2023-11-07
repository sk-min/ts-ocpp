import { ValidationError } from '../errors';
import { ActionName, Request, Response } from '.';
import { Either } from 'purify-ts';
export declare const validateMessageRequest: <T extends ActionName<"v1.6-json">>(action: string, body: object, acceptedActions: T[]) => Either<ValidationError, Request<T, "v1.6-json">>;
export declare const validateMessageResponse: <T extends ActionName<"v1.6-json">>(action: string, body: object, acceptedActions: T[]) => Either<ValidationError, Response<T, "v1.6-json">>;
