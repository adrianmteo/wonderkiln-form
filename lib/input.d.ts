import { ComponentType, PropsWithChildren, Ref } from 'react';
export declare type Maybe<T> = T | undefined | null;
declare type EventRef<T> = {
    onValidate?(value: T, data: any): void | Promise<void>;
    onSubmit?(value: T, data: any): void | Promise<void>;
};
declare type InputProps<T, W> = {
    name: string;
    required?: boolean;
    defaultValue?: Maybe<T>;
    onChange?: (value: Maybe<T>) => void;
    wrapper?: ComponentType<WrapperProps & W> | null;
};
declare type ComponentProps<T> = {
    value: Maybe<T>;
    setValue(value: Maybe<T>): void;
    disabled?: boolean;
    error?: Error;
    eventRef?: Ref<EventRef<T>>;
    onBlur(): void;
    setOnValue(key: string, value: any): void;
} & InputProps<T, any>;
export declare type WrapperProps = PropsWithChildren<ComponentProps<any>>;
export declare function createInput<T, C = {}, W = {}>(Component: ComponentType<ComponentProps<T> & C>, DefaultWrapper?: ComponentType<WrapperProps & W>): <WC = {}>(props: InputProps<T, WC> & C & W & WC) => JSX.Element;
export {};
