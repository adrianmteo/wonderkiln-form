import { ComponentType, Ref } from 'react';
export declare type Maybe<T> = T | undefined | null;
declare type EventRef<T> = {
    onValidate?(value: T, data: any): void | Promise<void>;
    onSubmit?(value: T, data: any): void | Promise<void>;
};
declare type InputProps<T, W> = {
    name: string;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: Maybe<T>;
    onChange?: (value: Maybe<T>) => void;
    wrapper?: ComponentType<ComponentProps<any> & W> | null;
};
declare type ComponentProps<T> = {
    value: Maybe<T>;
    setValue(value: Maybe<T>): void;
    error?: Error;
    eventRef?: Ref<EventRef<T>>;
    onBlur(): void;
    setOnValue(key: string, value: any): void;
} & InputProps<T, any>;
export declare function createInputWrapper<T = {}>(Component: ComponentType<ComponentProps<any> & T>): (props: ComponentProps<any> & T) => JSX.Element;
export declare function createInput<T, C = {}, W = {}>(Component: ComponentType<ComponentProps<T> & C>, DefaultWrapper?: ComponentType<ComponentProps<any> & W>): <WC = {}>(props: InputProps<T, WC> & C & W & WC) => JSX.Element;
export {};
