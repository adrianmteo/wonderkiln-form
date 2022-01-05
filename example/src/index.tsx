import { createForm, createInput, createInputWrapper } from '@wonderkiln/form'
import React from 'react'
import ReactDOM from 'react-dom'

const Form = createForm(({ children, onSubmit, error }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}
  >
    {children}
    {!!error && <p style={{ color: 'red' }}>{error.message}</p>}
    <button type="submit">Submit</button>
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

const StringInput = createInput<string, StringInput, InputWrapper>(({ value, setValue, placeholder, type }) => {
  return <input value={value ?? ''} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} type={type} />
}, InputWrapper)

function App() {
  return (
    <Form
      onSubmit={(data) => {
        console.log(data)
      }}
    >
      <StringInput name="email" label="Email" required />
      <StringInput name="password" label="Password" required type="password" />
    </Form>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
