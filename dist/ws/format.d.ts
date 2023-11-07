import { OCPPJMessage, OCPPJRawMessage } from './types';
import { ValidationError } from '../errors';
import { Either } from 'purify-ts';
export declare const parseOCPPMessage: (raw: OCPPJRawMessage) => Either<ValidationError, OCPPJMessage>;
export declare const stringifyOCPPMessage: (message: OCPPJMessage) => string;
