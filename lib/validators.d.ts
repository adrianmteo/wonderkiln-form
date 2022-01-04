import { Maybe } from './input';
export declare function validateRequired(value: any, message?: string): void;
export declare function validateEmail(value: Maybe<string>, message?: string): void;
export declare function validateRegex(value: Maybe<string>, regex: RegExp, message?: string): void;
