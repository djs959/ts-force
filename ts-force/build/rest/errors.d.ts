import { AxiosError } from 'axios';
import { CompositeBatchResult, InvokableResult } from '..';
export interface AxiosErrorException {
    type: 'axios';
    e: AxiosError;
}
export declare class CompositeError extends Error {
    compositeResponses: CompositeBatchResult<any, any>[];
}
export interface CompositeErrorException {
    type: 'composite';
    e: CompositeError;
}
export interface InvokableErrorException {
    type: 'invokable';
    e: InvokableResult<{}>;
}
export interface AnyErrorException {
    type: 'any';
    e: Error;
}
export interface StandardRestError {
    errorCode?: string;
    message: string;
}
export interface StandardizedSFError {
    errorDetails: StandardRestError[];
}
export type StandardAnyError = StandardizedSFError & AnyErrorException;
export type StandardAxiosError = StandardizedSFError & AxiosErrorException;
export type StandardCompositeError = StandardizedSFError & CompositeErrorException;
export type StandardInvokableError = StandardizedSFError & InvokableErrorException;
export type TsForceException = StandardAnyError | StandardAxiosError | StandardCompositeError | StandardInvokableError;
export declare const getStandardError: (e: Error) => TsForceException;
export declare const getExceptionError: (e: any) => AnyErrorException | AxiosErrorException | CompositeErrorException | InvokableErrorException;
export declare const isAxiosError: (error: any | AxiosError) => error is AxiosError<unknown, any>;
export declare const isCompositeError: (error: any | CompositeError) => error is CompositeError;
export declare const isInvokableError: (error: any | InvokableResult<any>) => error is InvokableResult<any>;
