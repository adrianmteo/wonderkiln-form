/// <reference types="node" />
import React, { ComponentType } from 'react';
declare class KeyValues<T> {
    id: number;
    data: Record<string, Record<number, T>>;
    add: (key: string, value: T) => () => void;
    get: (key: string) => T[];
    all: () => {
        key: string;
        value: T;
    }[];
}
declare type FormContext = {
    setDefaultValue(key: string, value: any): void;
    setValue(key: string, value: any): void;
    setOnValue(key: string, callback: (value: any, data: any) => void): () => void;
    setOnValidate(key: string, callback: (value: any, data: any) => void | Promise<void>): () => void;
    setOnSubmit(key: string, callback: (value: any, data: any) => void | Promise<void>): () => void;
    onBlur(key: string): void;
    errors: Record<string, Error>;
    loading?: boolean;
};
declare const FormContext: React.Context<FormContext>;
export declare function useForm(): FormContext;
declare type FormComponentProps = {
    onSubmit: () => void;
    loading?: boolean;
    error?: Error;
    errors: Record<string, Error>;
};
declare type FormData = Record<string, any>;
declare type FormProps = {
    onSubmit(data: FormData, delta: FormData): void | Promise<void>;
    onChange?(data: FormData): void;
    defaultValues?: FormData;
    validate?: 'onBlur' | 'onChange';
};
declare type FormState = {
    loading?: boolean;
    error?: Error;
    errors: Record<string, Error>;
};
export declare class FormError extends Error {
    key?: string | undefined;
    constructor(message: string, key?: string | undefined);
}
export declare function createForm<W>(Wrapper: ComponentType<FormComponentProps & W>): {
    new (props: FormProps & W): {
        state: FormState;
        defaultData: FormData;
        data: FormData;
        valueListeners: KeyValues<(value: any, data: FormData) => void>;
        validateListeners: KeyValues<(value: any, data: FormData) => void | Promise<void>>;
        submitListeners: KeyValues<(value: any, data: FormData) => void | Promise<void>>;
        setDefaultValue: (key: string, value: any) => void;
        setValue: (key: string, value: any) => void;
        setOnValue: (key: string, callback: (value: any, data: FormData) => void | Promise<void>) => () => void;
        setOnValidate: (key: string, callback: (value: any, data: FormData) => void | Promise<void>) => () => void;
        setOnSubmit: (key: string, callback: (value: any, data: FormData) => void | Promise<void>) => () => void;
        validateTimer: NodeJS.Timeout | undefined;
        validateTimeout: number;
        validate: (key: string, throttle: boolean) => Promise<unknown>;
        onBlur: (key: string) => void;
        onSubmit: () => Promise<void>;
        render(): JSX.Element;
        context: any;
        setState<K extends keyof FormState>(state: FormState | ((prevState: Readonly<FormState>, props: Readonly<FormProps & W>) => FormState | Pick<FormState, K> | null) | Pick<FormState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<FormProps & W> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<FormProps & W>, nextState: Readonly<FormState>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<FormProps & W>, prevState: Readonly<FormState>): any;
        componentDidUpdate?(prevProps: Readonly<FormProps & W>, prevState: Readonly<FormState>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<FormProps & W>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<FormProps & W>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<FormProps & W>, nextState: Readonly<FormState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<FormProps & W>, nextState: Readonly<FormState>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export {};
