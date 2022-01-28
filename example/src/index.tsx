import { createForm, createInput, createInputWrapper } from '@wonderkiln/form'
import React from 'react'
import ReactDOM from 'react-dom'

const Form = createForm(({ children, onSubmit, error, loading }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}
  >
    {children}
    {!!error && <p style={{ color: 'red' }}>{error.message}</p>}
    <button type="submit" disabled={loading}>
      Submit
    </button>
  </form>
))

type InputWrapper = { label: string }

const InputWrapper = createInputWrapper<InputWrapper>(({ label, children, error }) => {
  return (
    <section>
      <label>{label}</label>
      {children}
      {!!error && <p style={{ color: 'red' }}>{error.message}</p>}
    </section>
  )
})

type StringInput = { placeholder?: string; type?: string }

const StringInput = createInput<string, StringInput, InputWrapper>(
  ({ value, setValue, placeholder, type, disabled }) => {
    return (
      <input
        type={type}
        value={value ?? ''}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
  InputWrapper
)

function App() {
  return (
    <Form
      onSubmit={async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(data)
      }}
    >
      <StringInput name="email" label="Email" required />
      <StringInput name="password" label="Password" required type="password" />
    </Form>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
