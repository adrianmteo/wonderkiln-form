import React, { ComponentType, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from './form'
import { validateRequired } from './validators'

export type Maybe<T> = T | undefined | null

type EventRef<T> = {
  onValidate?(value: T, data: any): void | Promise<void>
  onSubmit?(value: T, data: any): void | Promise<void>
}

type InputProps<T, W> = {
  name: string
  required?: boolean
  disabled?: boolean
  defaultValue?: Maybe<T>
  onChange?: (value: Maybe<T>) => void
  wrapper?: ComponentType<ComponentProps<any> & W> | null
}

type ComponentProps<T> = {
  value: Maybe<T>
  setValue(value: Maybe<T>): void
  error?: Error
  eventRef?: Ref<EventRef<T>>
  onBlur(): void
  setOnValue(key: string, value: any): void
} & InputProps<T, any>

export function createInputWrapper<T = {}>(Component: ComponentType<ComponentProps<any> & T>) {
  return function (props: ComponentProps<any> & T) {
    return <Component {...props} />
  }
}

const DefaultWrapperComponent = createInputWrapper(({ children }) => children as React.ReactElement)

export function createInput<T, C = {}, W = {}>(
  Component: ComponentType<ComponentProps<T> & C>,
  DefaultWrapper: ComponentType<ComponentProps<any> & W> = DefaultWrapperComponent
) {
  return function <WC = {}>(props: InputProps<T, WC> & C & W & WC) {
    const eventRef = useRef<EventRef<T>>(null)

    const {
      setDefaultValue,
      setValue: setFormValue,
      setOnValue,
      setOnValidate,
      setOnSubmit,
      onBlur: onFormBlur,
      errors,
      loading,
    } = useForm()

    const [data, setData] = useState<Maybe<T>>()

    useEffect(() => {
      if (props.defaultValue !== undefined) {
        setDefaultValue(props.name, props.defaultValue)
      }

      const removeListener = setOnValue(props.name, (value) => {
        setData(value)
        props.onChange?.(value)
      })

      return () => {
        removeListener()
      }
    }, [props.name, props.onChange])

    useEffect(() => {
      return () => {
        setFormValue(props.name, undefined) // delete key if unmounted
      }
    }, [props.name])

    useEffect(() => {
      return setOnValidate(props.name, async (value, data) => {
        if (props.required) validateRequired(value)
        await eventRef.current?.onValidate?.(value, data)
      })
    }, [props.name, props.required])

    useEffect(() => {
      return setOnSubmit(props.name, async (value, data) => {
        await eventRef.current?.onSubmit?.(value, data)
      })
    }, [props.name])

    const setValue = useCallback(
      (value: any) => {
        setFormValue(props.name, value)
      },
      [props.name]
    )

    const onBlur = useCallback(() => {
      onFormBlur(props.name)
    }, [props.name])

    const error = useMemo(() => errors[props.name], [errors, props.name])

    const Wrapper = useMemo(() => {
      if (props.wrapper === null) return DefaultWrapperComponent
      if (props.wrapper) return props.wrapper
      return DefaultWrapper
    }, [props.wrapper])

    return (
      <Wrapper
        {...props}
        value={data}
        setValue={setValue}
        onBlur={onBlur}
        disabled={props.disabled || loading}
        error={error}
        eventRef={eventRef}
        setOnValue={setOnValue}
      >
        <Component
          {...props}
          value={data}
          setValue={setValue}
          onBlur={onBlur}
          disabled={props.disabled || loading}
          error={error}
          eventRef={eventRef}
          setOnValue={setOnValue}
        />
      </Wrapper>
    )
  }
}
