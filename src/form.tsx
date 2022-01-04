import React, { Component, ComponentType, createContext, useContext } from 'react'

class KeyValues<T> {
  id = 0
  data: Record<string, Record<number, T>> = {}

  add = (key: string, value: T) => {
    const newId = ++this.id

    if (!this.data[key]) this.data[key] = {}
    this.data[key][newId] = value

    return () => {
      delete this.data[key][newId]
    }
  }

  get = (key: string) => {
    return Object.values(this.data[key])
  }

  all = () => {
    return Object.keys(this.data).reduce((accumulator, key) => {
      Object.values(this.data[key]).forEach((value) => {
        accumulator.push({ key, value })
      })
      return accumulator
    }, [] as { key: string; value: T }[])
  }
}

type FormContext = {
  setDefaultValue(key: string, value: any): void
  setValue(key: string, value: any): void
  setOnValue(key: string, callback: (value: any, data: any) => void): () => void
  setOnValidate(key: string, callback: (value: any, data: any) => void | Promise<void>): () => void
  setOnSubmit(key: string, callback: (value: any, data: any) => void | Promise<void>): () => void
  onBlur(key: string): void
  errors: Record<string, Error>
  loading?: boolean
}

const FormContext = createContext<FormContext>({
  setDefaultValue() {},
  setValue() {},
  setOnValue() {
    return () => {}
  },
  setOnValidate() {
    return () => {}
  },
  setOnSubmit() {
    return () => {}
  },
  onBlur() {},
  errors: {},
})

export function useForm() {
  return useContext(FormContext)
}

type FormComponentProps = {
  onSubmit: () => void
  loading?: boolean
  error?: Error
  errors: Record<string, Error>
}

type FormData = Record<string, any>

type FormProps = {
  onSubmit(data: FormData, delta: FormData): void | Promise<void>
  onChange?(data: FormData): void
  defaultValues?: FormData
  validate?: 'onBlur' | 'onChange'
}

type FormState = {
  loading?: boolean
  error?: Error
  errors: Record<string, Error>
}

export class FormError extends Error {
  constructor(message: string, public key?: string) {
    super(message)
  }
}

export function createForm<W>(Wrapper: ComponentType<FormComponentProps & W>) {
  return class Form extends Component<FormProps & W, FormState> {
    state: FormState = {
      errors: {},
    }

    defaultData: FormData = {}
    data: FormData = {}

    valueListeners = new KeyValues<(value: any, data: FormData) => void>()
    validateListeners = new KeyValues<(value: any, data: FormData) => void | Promise<void>>()
    submitListeners = new KeyValues<(value: any, data: FormData) => void | Promise<void>>()

    constructor(props: FormProps & W) {
      super(props)

      if (props.defaultValues) {
        this.defaultData = { ...props.defaultValues }
        this.data = { ...props.defaultValues }
      }
    }

    setDefaultValue = (key: string, value: any) => {
      if (!(key in this.defaultData)) {
        this.defaultData[key] = value
        this.data[key] = value
      }
    }

    setValue = (key: string, value: any) => {
      this.data[key] = value

      if (typeof value === 'undefined') {
        delete this.data[key]
      }

      this.valueListeners.get(key).forEach((listener) => {
        listener(value, this.data)
      })

      this.props.onChange?.(this.data)

      if (this.props.validate === 'onChange') {
        this.validate(key, true)
      }
    }

    setOnValue = (key: string, callback: (value: any, data: FormData) => void | Promise<void>) => {
      callback(this.data[key], this.data)
      return this.valueListeners.add(key, callback)
    }

    setOnValidate = (key: string, callback: (value: any, data: FormData) => void | Promise<void>) => {
      return this.validateListeners.add(key, callback)
    }

    setOnSubmit = (key: string, callback: (value: any, data: FormData) => void | Promise<void>) => {
      return this.submitListeners.add(key, callback)
    }

    validateTimer: NodeJS.Timeout | undefined
    validateTimeout = 500

    validate = async (key: string, throttle: boolean) => {
      if (throttle) {
        if (this.validateTimer) clearTimeout(this.validateTimer)
        return await new Promise((resolve) => {
          this.validateTimer = setTimeout(() => {
            this.validate(key, false).then(resolve)
          }, this.validateTimeout)
        })
      }

      try {
        for (const listener of this.validateListeners.get(key)) {
          await listener(this.data[key], this.data)
        }
        this.setState((state) => {
          const errors = { ...state.errors }
          delete errors[key]
          return { errors }
        })
        return true
      } catch (error) {
        this.setState((state) => {
          const errors = { ...state.errors }
          errors[key] = error as Error
          return { errors }
        })
        return false
      }
    }

    onBlur = (key: string) => {
      if (!this.props.validate || this.props.validate === 'onBlur') {
        this.validate(key, false)
      }
    }

    onSubmit = async () => {
      this.setState({ loading: true, error: undefined, errors: {} })

      let hasErrors = false

      const errors: Record<string, Error> = {}

      for (const listener of this.validateListeners.all()) {
        try {
          await listener.value(this.data[listener.key], this.data)
        } catch (error) {
          errors[listener.key] = error as Error
          hasErrors = true
        }
      }

      if (!hasErrors) {
        for (const listener of this.submitListeners.all()) {
          try {
            await listener.value(this.data[listener.key], this.data)
          } catch (error) {
            errors[listener.key] = error as Error
            hasErrors = true
          }
        }
      }

      let error: Error | undefined

      if (!hasErrors) {
        const delta = { ...this.data }

        for (const key in delta) {
          if (delta[key] === this.defaultData[key]) {
            delete delta[key]
          }
        }

        try {
          await this.props.onSubmit(this.data, delta)
        } catch (err) {
          if (err instanceof FormError) {
            if (err.key) errors[err.key] = err
            else error = err
          } else if (err instanceof Error) {
            error = err
          } else {
            error = new FormError('An error occurred')
          }
        }
      }

      this.setState({ loading: false, error, errors })
    }

    render() {
      return (
        <FormContext.Provider
          value={{
            setDefaultValue: this.setDefaultValue,
            setValue: this.setValue,
            setOnValue: this.setOnValue,
            setOnValidate: this.setOnValidate,
            setOnSubmit: this.setOnSubmit,
            onBlur: this.onBlur,
            errors: this.state.errors,
            loading: this.state.loading,
          }}
        >
          <Wrapper
            {...this.props}
            onSubmit={this.onSubmit}
            error={this.state.error}
            errors={this.state.errors}
            loading={this.state.loading}
          >
            {this.props.children}
          </Wrapper>
        </FormContext.Provider>
      )
    }
  }
}
