import { createForm, createInput, WrapperProps } from '@wonderkiln/form'
import React from 'react'
import ReactDOM from 'react-dom'

const Form = createForm(({ children, onSubmit }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}
  >
    {children}
    <button type="submit">Submit</button>
  </form>
))

type Wrapper = { label: string }

function Wrapper({ children, label }: WrapperProps & Wrapper) {
  return (
    <section>
      <label>{label}</label>
      {children}
    </section>
  )
}

const StringInput = createInput<string, {}, Wrapper>(
  ({ value, setValue }) => <input value={value ?? ''} onChange={(e) => setValue(e.target.value)} />,
  Wrapper
)

function App() {
  return (
    <Form
      onSubmit={(data) => {
        console.log(data)
      }}
    >
      <StringInput name="email" label="Email" />
    </Form>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
