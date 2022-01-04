import { FormError } from './form'
import { Maybe } from './input'

export function validateRequired(value: any, message?: string) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    throw new FormError(message ?? 'Field is required')
  }
}

export function validateEmail(value: Maybe<string>, message?: string) {
  if (typeof value === 'string' && !value.includes('@')) {
    throw new FormError(message ?? 'Field is not an email')
  }
}

export function validateRegex(value: Maybe<string>, regex: RegExp, message?: string) {
  if (typeof value === 'string' && !regex.test(value)) {
    throw new FormError(message ?? `Field doesn't match ${regex.source}`)
  }
}

// More...
